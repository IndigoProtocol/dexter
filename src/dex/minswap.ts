import { LiquidityPool } from './models/liquidity-pool';
import { BaseDataProvider } from '@providers/data/base-data-provider';
import { Asset, Token } from './models/asset';
import { BaseDex } from './base-dex';
import {
    AssetAddress,
    AssetBalance,
    DatumParameters, DefinitionConstr, DefinitionField,
    PayToAddress,
    RequestConfig, SpendUTxO,
    SwapFee,
    UTxO
} from '@app/types';
import { DefinitionBuilder } from '@app/definition-builder';
import { correspondingReserves } from '@app/utils';
import { AddressType, DatumParameterKey } from '@app/constants';
import order from '@dex/definitions/minswap/order';
import { BaseApi } from '@dex/api/base-api';
import { MinswapApi } from '@dex/api/minswap-api';
import pool from '@dex/definitions/minswap/pool';
import { Script } from 'lucid-cardano';

export class Minswap extends BaseDex {

    public static readonly identifier: string = 'Minswap';
    public readonly api: BaseApi;

    /**
     * On-Chain constants.
     */
    public readonly marketOrderAddress: string = 'addr1wxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc0h43gt';
    public readonly limitOrderAddress: string = 'addr1zxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uw6j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq6s3z70';
    public readonly lpTokenPolicyId: string = 'e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86';
    public readonly poolNftPolicyId: string = '0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1';
    public readonly poolValidityAsset: string = '13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f4d494e53574150';
    public readonly cancelDatum: string = 'd87a80';
    public readonly orderScript: Script = {
        type: 'PlutusV1',
        script: '59014f59014c01000032323232323232322223232325333009300e30070021323233533300b3370e9000180480109118011bae30100031225001232533300d3300e22533301300114a02a66601e66ebcc04800400c5288980118070009bac3010300c300c300c300c300c300c300c007149858dd48008b18060009baa300c300b3754601860166ea80184ccccc0288894ccc04000440084c8c94ccc038cd4ccc038c04cc030008488c008dd718098018912800919b8f0014891ce1317b152faac13426e6a83e06ff88a4d62cce3c1634ab0a5ec133090014a0266008444a00226600a446004602600a601a00626600a008601a006601e0026ea8c03cc038dd5180798071baa300f300b300e3754601e00244a0026eb0c03000c92616300a001375400660106ea8c024c020dd5000aab9d5744ae688c8c0088cc0080080048c0088cc00800800555cf2ba15573e6e1d200201',
    };

    constructor(requestConfig: RequestConfig = {}) {
        super();

        this.api = new MinswapApi(this, requestConfig);
    }

    public async liquidityPoolAddresses(provider: BaseDataProvider): Promise<string[]> {
        const validityAsset: Asset = Asset.fromIdentifier(this.poolValidityAsset);
        const assetAddresses: AssetAddress[] = await provider.assetAddresses(validityAsset);

        return Promise.resolve([...new Set(assetAddresses.map((assetAddress: AssetAddress) => assetAddress.address))]);
    }

    public async liquidityPools(provider: BaseDataProvider): Promise<LiquidityPool[]> {
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

        const relevantAssets: AssetBalance[] = utxo.assetBalances
            .filter((assetBalance: AssetBalance) => {
                const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.identifier();

                return assetBalanceId !== this.poolValidityAsset
                    && ! assetBalanceId.startsWith(this.lpTokenPolicyId)
                    && ! assetBalanceId.startsWith(this.poolNftPolicyId);
            });

        // Irrelevant UTxO
        if (relevantAssets.length < 2) {
            return Promise.resolve(undefined);
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const liquidityPool: LiquidityPool = new LiquidityPool(
            Minswap.identifier,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
            utxo.address,
            this.marketOrderAddress,
            this.limitOrderAddress,
        );

        // Load additional pool information
        const poolNft: Asset | undefined = utxo.assetBalances.find((assetBalance: AssetBalance) => {
            return assetBalance.asset !== 'lovelace' && assetBalance.asset.policyId === this.poolNftPolicyId;
        })?.asset as Asset;

        if (! poolNft) return undefined;

        liquidityPool.lpToken = new Asset(this.lpTokenPolicyId, poolNft.nameHex);
        liquidityPool.identifier = liquidityPool.lpToken.identifier();
        liquidityPool.poolFeePercent = 0.3;

        try {
            liquidityPool.poolFeePercent = 0.3;

            const builder: DefinitionBuilder = await (new DefinitionBuilder())
                .loadDefinition(pool);
            const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
            const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

            // Ignore Zap orders
            if (typeof parameters.PoolAssetBPolicyId === 'string' && parameters.PoolAssetBPolicyId === this.lpTokenPolicyId) {
                return undefined;
            }

            liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                ? BigInt(parameters.TotalLpTokens)
                : 0n;
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

        return swapInNumerator / swapInDenominator + 1n;
    }

    public estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const poolFeeMultiplier: bigint = 10000n;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((liquidityPool.poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * reserveOut * poolFeeModifier;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        return swapOutNumerator / swapOutDenominator;
    }

    public priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const poolFeeMultiplier: bigint = 10000n;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt(Math.round((liquidityPool.poolFeePercent / 100) * Number(poolFeeMultiplier)));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * poolFeeModifier * reserveOut;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        const priceImpactNumerator: bigint = (reserveOut * swapInAmount * swapOutDenominator * poolFeeModifier)
            - (swapOutNumerator * reserveIn * poolFeeMultiplier);
        const priceImpactDenominator: bigint = reserveOut * swapInAmount * swapOutDenominator * poolFeeMultiplier;

        return Number(priceImpactNumerator * 100n) / Number(priceImpactDenominator);
    }

    public async buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos: SpendUTxO[] = []): Promise<PayToAddress[]> {
        const batcherFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'batcherFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');

        if (! batcherFee || ! deposit) {
            return Promise.reject('Parameters for datum are not set.');
        }

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.BatcherFee]: batcherFee.value,
            [DatumParameterKey.DepositFee]: deposit.value,
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
                    address: this.marketOrderAddress,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: batcherFee.value + deposit.value,
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
            return [this.marketOrderAddress, this.limitOrderAddress].includes(utxo.address);
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
                id: 'batcherFee',
                title: 'Batcher Fee',
                description: 'Fee paid for the service of off-chain Laminar batcher to process transactions.',
                value: 2_000000n,
                isReturned: false,
            },
            {
                id: 'deposit',
                title: 'Deposit',
                description: 'This amount of ADA will be held as minimum UTxO ADA and will be returned when your order is processed or cancelled.',
                value: 2_000000n,
                isReturned: true,
            },
        ];
    }

}
