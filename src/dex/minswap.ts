import { LiquidityPool } from './models/liquidity-pool';
import { DataProvider } from '../providers/data/data-provider';
import { Asset, Token } from './models/asset';
import { BaseDex } from './base-dex';
import {
    AssetBalance,
    DatumParameters,
    DefinitionConstr,
    DefinitionField,
    PayToAddress,
    SwapFee,
    UTxO
} from '../types';
import { DefinitionBuilder } from '../definition-builder';
import { correspondingReserves } from '../utils';
import { AddressType, DatumParameterKey } from '../constants';

/**
 * Minswap constants.
 */
const POOL_ADDRESS: string = 'addr1z8snz7c4974vzdpxu65ruphl3zjdvtxw8strf2c2tmqnxz2j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq0xmsha';
const MARKET_ORDER_ADDRESS: string = 'addr1wxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc0h43gt';
const LIMIT_ORDER_ADDRESS: string = 'addr1zxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uw6j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq6s3z70';
const POOL_VALIDITY_ASSET: string = '13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f4d494e53574150';
const LP_TOKEN_POLICY_ID: string = 'e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86';
const POOL_NFT_POLICY_ID: string = '0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1';

export class Minswap extends BaseDex {

    public readonly name: string = 'Minswap';

    public async liquidityPools(provider: DataProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const utxos: UTxO[] = await provider.utxos(POOL_ADDRESS, (assetA === 'lovelace' ? undefined : assetA));
        const builder: DefinitionBuilder = await (new DefinitionBuilder())
            .loadDefinition('/minswap/pool.js');

        const liquidityPoolPromises: Promise<LiquidityPool | undefined>[] = utxos.map(async (utxo: UTxO) => {
            const liquidityPool: LiquidityPool | undefined = this.liquidityPoolFromUtxo(utxo, assetA, assetB);

            if (liquidityPool) {
                const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
                const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

                liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                    ? BigInt(parameters.TotalLpTokens)
                    : 0n;
            }

            return liquidityPool;
        });

        return await Promise.all(liquidityPoolPromises)
            .then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[]
            });
    }

    public liquidityPoolFromUtxo(utxo: UTxO, assetA: Token, assetB?: Token): LiquidityPool | undefined {
        if (! utxo.datumHash) {
            return undefined;
        }

        const assetAId: string = assetA === 'lovelace' ? 'lovelace' : assetA.id();
        const assetBId: string = assetB ? (assetB === 'lovelace' ? 'lovelace' : assetB.id()) : '';

        const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id();

            return assetBalanceId !== POOL_VALIDITY_ASSET
                && ! assetBalanceId.startsWith(LP_TOKEN_POLICY_ID)
                && ! assetBalanceId.startsWith(POOL_NFT_POLICY_ID);
        });

        // Irrelevant UTxO
        if (relevantAssets.length < 2) {
            return undefined;
        }

        // Could be ADA/X or X/X pool
        const assetAIndex: number = relevantAssets.length === 2 ? 0 : 1;
        const assetBIndex: number = relevantAssets.length === 2 ? 1 : 2;

        const relevantAssetAId: string = relevantAssets[assetAIndex].asset === 'lovelace'
            ? 'lovelace'
            : (relevantAssets[assetAIndex].asset as Asset).id()
        const relevantAssetBId: string = relevantAssets[assetBIndex].asset === 'lovelace'
            ? 'lovelace'
            : (relevantAssets[assetBIndex].asset as Asset).id()

        // Only grab requested pools
        const matchesFilter: boolean = (relevantAssetAId === assetAId && relevantAssetBId === assetBId)
            || (relevantAssetAId === assetBId && relevantAssetBId === assetAId)
            || (relevantAssetAId === assetAId && ! assetBId)
            || (relevantAssetBId === assetAId && ! assetBId);

        if (! matchesFilter) {
            return undefined;
        }

        const liquidityPool: LiquidityPool = new LiquidityPool(
            this.name,
            utxo.address,
            relevantAssets[assetAIndex].asset,
            relevantAssets[assetBIndex].asset,
            relevantAssets[assetAIndex].quantity,
            relevantAssets[assetBIndex].quantity,
        );

        const lpToken: Asset | undefined = utxo.assetBalances.find((assetBalance) => {
            return assetBalance.asset !== 'lovelace' && assetBalance.asset.policyId === LP_TOKEN_POLICY_ID;
        })?.asset as Asset;

        if (lpToken) {
            liquidityPool.lpToken = lpToken;
            liquidityPool.identifier = lpToken.policyId;
        }

        liquidityPool.poolFee = 0.3;

        return liquidityPool;
    }

    public estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const poolFeeMultiplier: bigint = 1000n;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt((liquidityPool.poolFee / 100) * Number(poolFeeMultiplier));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * poolFeeModifier * reserveOut;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        return swapOutNumerator / swapOutDenominator;
    }

    public priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const poolFeeMultiplier: bigint = 1000n;
        const poolFeeModifier: bigint = poolFeeMultiplier - BigInt((liquidityPool.poolFee / 100) * Number(poolFeeMultiplier));

        const [reserveIn, reserveOut]: bigint[] = correspondingReserves(liquidityPool, swapInToken);

        const swapOutNumerator: bigint = swapInAmount * poolFeeModifier * reserveOut;
        const swapOutDenominator: bigint = swapInAmount * poolFeeModifier + reserveIn * poolFeeMultiplier;

        const priceImpactNumerator: bigint = (reserveOut * swapInAmount * swapOutDenominator * poolFeeModifier)
            - (swapOutNumerator * reserveIn * poolFeeMultiplier);
        const priceImpactDenominator: bigint = reserveOut * swapInAmount * swapOutDenominator * poolFeeMultiplier;

        return Number(priceImpactNumerator * 100n) / Number(priceImpactDenominator);
    }

    public buildSwapOrder(swapParameters: DatumParameters): PayToAddress[] {
        const batcherFee: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'batcherFee');
        const deposit: SwapFee | undefined = this.swapOrderFees().find((fee: SwapFee) => fee.id === 'deposit');

        if (! batcherFee || ! deposit) {
            throw new Error('Parameters for datum are not set.');
        }

        swapParameters = {
            ...swapParameters,
            [DatumParameterKey.BatcherFee]: batcherFee.value,
            [DatumParameterKey.DepositFee]: deposit.value,
        };

        const datumBuilder: DefinitionBuilder = new DefinitionBuilder();
        datumBuilder.loadDefinition('/minswap/swap.ts')
            .then((builder: DefinitionBuilder) => {
                builder.pushParameters(swapParameters);
            });

        return [
            this.buildSwapOrderPayment(
                swapParameters,
                {
                    address: MARKET_ORDER_ADDRESS,
                    addressType: AddressType.Contract,
                    assetBalances: [
                        {
                            asset: 'lovelace',
                            quantity: batcherFee.value + deposit.value,
                        },
                    ],
                    datum: datumBuilder.getCbor(),
                }
            )
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