import { BaseDex } from './base-dex';
import {
    DatumParameters,
    PayToAddress,
    SpendUTxO,
    SwapFee,
    UTxO
} from '@app/types';
import { correspondingReserves, tokensMatch } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import { DefinitionBuilder } from '@app/definition-builder';
import order from '@dex/definitions/wingriders-v2/order';
import { Script } from 'lucid-cardano';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';

export class WingRidersV2 extends BaseDex {

    public static readonly identifier: string = 'WingRidersV2';

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1w8qnfkpe5e99m7umz4vxnmelxs5qw5dxytmfjk964rla98q605wte';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV2',
        script: '59019e010000323232323232323232222325333008001149858c8c8c94ccc028cdc3a40040042664601444a666aae7c0045280a99980699baf301000100314a226004601c00264646464a66601c66e1d20000021301100116301100230110013754601c601a002601a6010601800c646eb0c038c8c034c034c034c034c034c034c028004c034004c034c0300104ccc888cdc79919191bae301300132323253330123370e90000010b0800980a801180a8009baa3012301100132301230110013011300f301000133300c222533301033712900500109980199b8100248028c044c044c044c044c04400454ccc040cdc3801240002602600226644a66602466e20009200016133301122253330153370e00490000980c00089980199b8100248008c058004008004cdc0801240046022002004646eb0c044c040004c040c03c00400cdd70039bad300d001004300d002300d00137540046ea52211caf97793b8702f381976cec83e303e9ce17781458c73c4bb16fe02b83002300430040012323002233002002001230022330020020015734ae888c00cdd5000aba15573caae741',
    };

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        if (! liquidityPool.state) return 0n;

        const poolFeeMultiplier: bigint = 10000n;
        const poolFeePercent: number = tokensMatch(liquidityPool.tokenA, swapOutToken) ? liquidityPool.state.sellFeePercent : liquidityPool.state.buyFeePercent;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        const swapInNumerator: bigint = swapOutAmount * reserveIn * poolFeeMultiplier;
        const swapInDenominator: bigint = (reserveOut - swapOutAmount) * poolFeeModifier;

        return swapInNumerator / swapInDenominator;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        if (! liquidityPool.state) return 0n;

        const poolFeeMultiplier: bigint = 10000n;
        const poolFeePercent: number = tokensMatch(liquidityPool.tokenA, swapInToken) ? liquidityPool.state.buyFeePercent : liquidityPool.state.sellFeePercent;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * reserveOut * poolFeeModifier;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        return swapOutNumerator / swapOutDenominator;
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const swapOutTokenDecimals: number = tokensMatch(liquidityPool.tokenA, swapInToken)
            ? (liquidityPool.tokenB.decimals ?? 0)
            : (liquidityPool.tokenA === 'lovelace' ? 6 : liquidityPool.tokenA.decimals ?? 0)

        const estimatedReceive: bigint = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);
        const swapPrice: number = (Number(swapInAmount) / 10**(swapInToken === 'lovelace' ? 6 : swapInToken.decimals ?? 0))
            / (Number(estimatedReceive) / 10**swapOutTokenDecimals);
        const poolPrice: number = tokensMatch(liquidityPool.tokenA, swapInToken)
            ? liquidityPool.price
            : (1 / liquidityPool.price);

        return Math.abs(swapPrice - poolPrice)
            / ((swapPrice + poolPrice) / 2)
            * 100;
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: SpendUTxO[] = []): Promise<PayToAddress[]> {
        const agentFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'agentFee');
        const oil: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'oil');

        if (! agentFee || ! oil) {
            return Promise.reject('Parameters for datum are not set.');
        }

        const swapInToken: string = (swapParameters.SwapInTokenPolicyId as string) + (swapParameters.SwapInTokenAssetName as string);
        const swapOutToken: string = (swapParameters.SwapOutTokenPolicyId as string) + (swapParameters.SwapOutTokenAssetName as string);
        const swapDirection: number = [swapInToken, swapOutToken].sort((a: string, b: string) => {
            return a.localeCompare(b);
        })[0] === swapInToken ? 0 : 1;

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.Action]: swapDirection,
            [DatumParameterKey.DepositFee]: 2_000000n,
            [DatumParameterKey.Expiration]: new Date().getTime() + (60 * 60 * 6 * 1000),
            [DatumParameterKey.AScale]: 1,
            [DatumParameterKey.BScale]: 1,
            [DatumParameterKey.PoolAssetAPolicyId]: swapDirection === 0
                ? swapParameters.SwapInTokenPolicyId
                : swapParameters.SwapOutTokenPolicyId,
            [DatumParameterKey.PoolAssetAAssetName]: swapDirection === 0
                ? swapParameters.SwapInTokenAssetName
                : swapParameters.SwapOutTokenAssetName,
            [DatumParameterKey.PoolAssetBPolicyId]: swapDirection === 0
                ? swapParameters.SwapOutTokenPolicyId
                : swapParameters.SwapInTokenPolicyId,
            [DatumParameterKey.PoolAssetBAssetName]: swapDirection === 0
                ? swapParameters.SwapOutTokenAssetName
                : swapParameters.SwapInTokenAssetName,
        };

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        await datumBuilder.loadDefinition(order)
            .then((builder: DefinitionBuilder) => {
                builder.pushParameters(swapParameters);
            });

        return [
            this.buildSwapOrderPayment(
                swapParameters,
                {
                    address: this.orderAddress,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: agentFee.value + oil.value,
                        },
                    ],
                    datum: datumBuilder.getCbor(),
                    isInlineDatum: true,
                    spendUtxos: spendUtxos,
                }
            )
        ];
    }

    public async buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]> {
        const relevantUtxo: UTxO | undefined = txOutputs.find((utxo: UTxO) => {
            return utxo.address === this.orderAddress;
        });

        if (! relevantUtxo) {
            return Promise.reject('Unable to find relevant UTxO for cancelling the swap order.');
        }

        return [
            {
                address: returnAddress,
                addressType: AddressType.Base,
                assetBalances: relevantUtxo.assetBalances,
                isInlineDatum: false,
                spendUtxos: [{
                    utxo: relevantUtxo,
                    redeemer: this.cancelDatum,
                    validator: this.orderScript,
                    signer: returnAddress,
                }],
            }
        ];
    }

    public swapOrderFees(): SwapFee[] {
        return [
            {
                id: 'agentFee',
                title: 'Agent Fee',
                description: 'WingRiders DEX employs decentralized Agents to ensure equal access, strict fulfillment ordering and protection to every party involved in exchange for a small fee.',
                value: 2_000000n,
                isReturned: false,
            },
            {
                id: 'oil',
                title: 'Oil',
                description: 'A small amount of ADA has to be bundled with all token transfers on the Cardano Blockchain. We call this "Oil ADA" and it is always returned to the owner when the request gets fulfilled. If the request expires and the funds are reclaimed, the Oil ADA is returned as well.',
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }

}
