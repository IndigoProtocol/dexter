import { BaseDex } from './base-dex';
import {
    AssetAddress,
    AssetBalance,
    DatumParameters,
    DefinitionConstr,
    DefinitionField,
    PayToAddress,
    RequestConfig, SpendUTxO,
    SwapFee,
    UTxO
} from '@app/types';
import { Asset, Token } from './models/asset';
import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { correspondingReserves, tokensMatch } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import { DefinitionBuilder } from '@app/definition-builder';
import order from '@dex/definitions/wingriders-v2/order';
import { BaseApi } from '@dex/api/base-api';
import pool from "@dex/definitions/wingriders-v2/pool";
import { Script } from 'lucid-cardano';

/**
 * WingRiders constants.
 */
const MIN_POOL_ADA: bigint = 3_000_000n;
const MAX_INT: bigint = 9_223_372_036_854_775_807n;

export class WingRidersV2 extends BaseDex {

    public static readonly identifier: string = 'WingRidersV2';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly orderAddress: string = 'addr1w8qnfkpe5e99m7umz4vxnmelxs5qw5dxytmfjk964rla98q605wte';
    public readonly poolValidityAsset: string = '6fdc63a1d71dc2c65502b79baae7fb543185702b12c3c5fb639ed7374c';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV2',
        script: '59019e010000323232323232323232222325333008001149858c8c8c94ccc028cdc3a40040042664601444a666aae7c0045280a99980699baf301000100314a226004601c00264646464a66601c66e1d20000021301100116301100230110013754601c601a002601a6010601800c646eb0c038c8c034c034c034c034c034c034c028004c034004c034c0300104ccc888cdc79919191bae301300132323253330123370e90000010b0800980a801180a8009baa3012301100132301230110013011300f301000133300c222533301033712900500109980199b8100248028c044c044c044c044c04400454ccc040cdc3801240002602600226644a66602466e20009200016133301122253330153370e00490000980c00089980199b8100248008c058004008004cdc0801240046022002004646eb0c044c040004c040c03c00400cdd70039bad300d001004300d002300d00137540046ea52211caf97793b8702f381976cec83e303e9ce17781458c73c4bb16fe02b83002300430040012323002233002002001230022330020020015734ae888c00cdd5000aba15573caae741',
    };

    private _assetAddresses: AssetAddress[] = [];

    constructor(requestConfig: RequestConfig = {}) {
        super();
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        const validityAsset: Asset = Asset.fromIdentifier(this.poolValidityAsset);
        const assetAddresses: AssetAddress[] = this._assetAddresses.length > 0
            ? this._assetAddresses
            : await provider.assetAddresses(validityAsset);

        return Promise.resolve([...new Set(assetAddresses.map((assetAddress: AssetAddress) => assetAddress.address))]);
    }

    async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
        const validityAsset: Asset = Asset.fromIdentifier(this.poolValidityAsset);
        const poolAddresses: string[] = await this.liquidityPoolAddresses(provider);

        const addressPromises: Promise<LiquidityPool[]>[] = poolAddresses.map(async (address: string) => {
            const utxos: UTxO[] = await provider.utxos(address, validityAsset);

            return await Promise.all(
                utxos.map(async (utxo: UTxO) => {
                    return await this.liquidityPoolFromUtxo(provider, utxo);
                })
            )
            .then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[]
            });
        });

        return Promise.all(addressPromises)
            .then((liquidityPools: (Awaited<LiquidityPool[]>)[]) => liquidityPools.flat());
    }

    public async liquidityPoolFromUtxo(provider: BaseDataProvider, utxo: UTxO): Promise<LiquidityPool | undefined> {
        if (! utxo.datumHash) {
            return Promise.resolve(undefined);
        }

        const validityAsset: Asset = Asset.fromIdentifier(this.poolValidityAsset);

        const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.identifier();

            return ! assetBalanceId.startsWith(validityAsset.policyId);
        });

        // Irrelevant UTxO
        if (relevantAssets.length < 2) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const assetAQuantity: bigint = relevantAssets[assetAIndex].quantity;
        const assetBQuantity: bigint = relevantAssets[assetBIndex].quantity;
        const liquidityPool: LiquidityPool = new LiquidityPool(
            WingRidersV2.identifier,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].asset === 'lovelace'
                ? (assetAQuantity - MIN_POOL_ADA < 1_000_000n)
                    ? assetAQuantity - MIN_POOL_ADA
                    : assetAQuantity
                : assetAQuantity,
            relevantAssets[assetBIndex].asset === 'lovelace'
                ? (assetBQuantity - MIN_POOL_ADA < 1_000_000n)
                    ? assetBQuantity - MIN_POOL_ADA
                    : assetBQuantity
                : assetBQuantity,
            utxo.address,
            this.orderAddress,
            this.orderAddress,
        );

        const lpTokenBalance: AssetBalance | undefined = utxo.assetBalances.find((assetBalance) => {
            return assetBalance.asset !== 'lovelace'
                && assetBalance.asset.policyId === validityAsset.policyId
                && assetBalance.asset.nameHex !== validityAsset.nameHex;
        });

        if (lpTokenBalance) {
            liquidityPool.lpToken = lpTokenBalance.asset as Asset;
            liquidityPool.identifier = liquidityPool.lpToken.identifier();
            liquidityPool.totalLpTokens = MAX_INT - lpTokenBalance.quantity;
        }
        liquidityPool.poolFeePercent = 0.35;

        try {
            const builder: DefinitionBuilder = await (new DefinitionBuilder())
                .loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            liquidityPool.reserveA = typeof parameters.PoolAssetATreasury === 'number'
                ? (liquidityPool.reserveA - BigInt(parameters.PoolAssetATreasury))
                : liquidityPool.reserveA;
            liquidityPool.reserveB = typeof parameters.PoolAssetBTreasury === 'number'
                ? (liquidityPool.reserveB - BigInt(parameters.PoolAssetBTreasury))
                : liquidityPool.reserveB;
        } catch (e) {
            return liquidityPool;
        }

        return liquidityPool;
    }

    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint {
        const poolFeeMultiplier: bigint = 10000n;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((liquidityPool.poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveOut, reserveIn]: bigint[] = correspondingReserves(liquidityPool, swapOutToken);

        const swapInNumerator: bigint = swapOutAmount * reserveIn * poolFeeMultiplier;
        const swapInDenominator: bigint = (reserveOut - swapOutAmount) * poolFeeModifier;

        return swapInNumerator / swapInDenominator;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const poolFeeMultiplier: bigint = 10000n;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((liquidityPool.poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * reserveOut * poolFeeModifier;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        return swapOutNumerator / swapOutDenominator;
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const swapOutTokenDecimals: number = tokensMatch(liquidityPool.assetA, swapInToken)
            ? (liquidityPool.assetB === 'lovelace' ? 6 : liquidityPool.assetB.decimals)
            : (liquidityPool.assetA === 'lovelace' ? 6 : liquidityPool.assetA.decimals)

        const estimatedReceive: bigint = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);
        const swapPrice: number = (Number(swapInAmount) / 10**(swapInToken === 'lovelace' ? 6 : swapInToken.decimals))
            / (Number(estimatedReceive) / 10**swapOutTokenDecimals);
        const poolPrice: number = tokensMatch(liquidityPool.assetA, swapInToken)
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
