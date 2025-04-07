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
import order from '@dex/definitions/wingriders-v1/order';
import { Script } from 'lucid-cardano';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';

/**
 * WingRiders constants.
 */

export class WingRiders extends BaseDex {

    public static readonly identifier: string = 'WingRiders';

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1wxr2a8htmzuhj39y2gq7ftkpxv98y2g67tg8zezthgq4jkg0a4ul4';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV1',
        script: '590370010000332332233322232323332223332223233223232323232332233222232322323225335301533225335301a00221333573466e3c02cdd7299a9a8101980924004a66a6a040660249000299a9a8101980924000a66a6a04066024900019a980b8900098099bac5335350203301248000d4d54054c0440088800858884008004588854cd4d4088004588854cd4d409000440088858588854cd4d4088004588854cd4d4090004588854cd4d409800440188858588854cd4d4088004588854cd4d409000440108858588854cd4d4088004400888580680644cc88d4c03400888d4c0440088888cc05cdd70019918139bac0015335350273301948000d4d54070c06001c88008588854cd4d40a4004588854cd4d40ac004588854cd4d40b4004588854cd4d40bc004588854cd4d40c4004588854cd4d40cc004588854cd4d40d400458884008cccd5cd19b8735573aa010900011980699191919191999ab9a3370e6aae75401120002333301535742a0086ae85400cd5d0a8011aba135744a004464c6a605266ae700900a80680644d5d1280089aba25001135573ca00226ea8004d5d0a8041aba135744a010464c6a604666ae7007809005004c004cccd5cd19b8750024800880688cccd5cd19b875003480008c8c074004dd69aba135573ca00a464c6a604466ae7007408c04c0480440044084584d55cea80089baa001135573ca00226ea80048848cc00400c0088004888848cccc00401401000c0088004c8004d540548894cd4d404c00440308854cd4c034ccd5cd19b8f00400200f00e100f13300500400125335350103300248000004588854cd4d4048004588854cd4d40500044cd54028010008885888c8d4d54018cd5401cd55cea80098021aab9e5001225335300b333573466e1c0140080340304004584dd5000990009aa809111999aab9f0012501223350113574200460066ae8800800d26112212330010030021120013200135500e2212253353500d0021622153353007333573466e1c00d2000009008100213353006120010013370200690010910010910009000909118010018910009000a490350543100320013550062233335573e0024a00c466a00a6eb8d5d080118019aba2002007112200212212233001004003120011200120011123230010012233003300200200148811ce6c90a5923713af5786963dee0fdffd830ca7e0c86a041d9e5833e910001',
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
        if (! liquidityPool.state) return 0;

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
            [DatumParameterKey.Expiration]: new Date().getTime() + (60 * 60 * 6 * 1000),
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
                    isInlineDatum: false,
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
