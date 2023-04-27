import { LiquidityPool } from './models/liquidity-pool';
import { BaseProvider } from '../provider/base-provider';
import { Asset, Token } from './models/asset';
import { BaseDex } from './base-dex';
import { AssetBalance, DatumParameters, DefinitionConstr, DefinitionField, UTxO } from '../types';
import { DefinitionBuilder } from '../definition-builder';
import { tokensMatch } from '../utils';

export class SundaeSwap extends BaseDex {

    public readonly name: string = 'SundaeSwap';

    private readonly poolAddress: string = 'addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu';
    private readonly orderAddress: string = 'addr1wxaptpmxcxawvr3pzlhgnpmzz3ql43n2tc8mn3av5kx0yzs09tqh8';
    private readonly lpTokenPolicyId: string = '0029cb7c88c7567b63d1a512c0ed626aa169688ec980730c0473b913';

    async liquidityPools(provider: BaseProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const utxos: UTxO[] = await provider.utxos(this.poolAddress, (assetA === 'lovelace' ? undefined : assetA));
        const builder: DefinitionBuilder = await (new DefinitionBuilder())
            .loadDefinition('/sundaeswap/pool.js');

        const liquidityPoolPromises: Promise<LiquidityPool | undefined>[] = utxos.map(async (utxo: UTxO) => {
            const liquidityPool: LiquidityPool | undefined = this.liquidityPoolFromUtxo(utxo, assetA, assetB);

            if (liquidityPool) {
                const datum: DefinitionField = await provider.datumValue(utxo.datumHash);
                const parameters: DatumParameters = builder.pullParameters(datum as DefinitionConstr);

                liquidityPool.identifier = typeof parameters.PoolIdentifier === 'string'
                    ? parameters.PoolIdentifier
                    : '';
                liquidityPool.totalLpTokens = typeof parameters.TotalLpTokens === 'number'
                    ? BigInt(parameters.TotalLpTokens)
                    : 0n;
                liquidityPool.poolFee = typeof parameters.LpFeeNumerator === 'number' && typeof parameters.LpFeeDenominator === 'number'
                    ? (parameters.LpFeeNumerator / parameters.LpFeeDenominator) * 100
                    : 0;
            }

            return liquidityPool;
        });

        return await Promise.all(liquidityPoolPromises)
            .then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[];
            });
    }

    liquidityPoolFromUtxo(utxo: UTxO, assetA: Token, assetB?: Token): LiquidityPool | undefined {
        if (! utxo.datumHash) {
            return undefined;
        }

        const assetAId: string = assetA === 'lovelace' ? 'lovelace' : assetA.id();
        const assetBId: string = assetB ? (assetB === 'lovelace' ? 'lovelace' : assetB.id()) : '';

        const relevantAssets: AssetBalance[] = utxo.assetBalances.filter((assetBalance: AssetBalance) => {
            const assetBalanceId: string = assetBalance.asset === 'lovelace' ? 'lovelace' : assetBalance.asset.id();

            return ! assetBalanceId.startsWith(this.lpTokenPolicyId);
        });

        // Irrelevant UTxO
        if (! [2, 3].includes(relevantAssets.length)) {
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

        const lpToken: Asset = utxo.assetBalances.find((assetBalance) => {
            return assetBalance.asset !== 'lovelace' && assetBalance.asset.policyId === this.lpTokenPolicyId;
        })?.asset as Asset;

        if (lpToken) {
            lpToken.assetNameHex = '6c' + lpToken.assetNameHex;
            liquidityPool.lpToken = lpToken;
        }

        return liquidityPool;
    }

    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint {
        const [reserveIn, reserveOut]: bigint[] = tokensMatch(swapInToken, liquidityPool.assetA)
            ? [liquidityPool.reserveA, liquidityPool.reserveB]
            : [liquidityPool.reserveB, liquidityPool.reserveA];

        const swapFee: bigint = ((swapInAmount * BigInt(liquidityPool.poolFee * 100)) + BigInt(10000) - 1n) / 10000n;
        const adjustedSwapInAmount: bigint = swapInAmount - swapFee;

        return reserveOut - (reserveIn * reserveOut) / (reserveIn + adjustedSwapInAmount);
    }

    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number {
        const estimatedReceive: bigint = this.estimatedReceive(liquidityPool, swapInToken, swapInAmount);
        const [reserveIn, reserveOut]: bigint[] = tokensMatch(swapInToken, liquidityPool.assetA)
            ? [liquidityPool.reserveA, liquidityPool.reserveB]
            : [liquidityPool.reserveB, liquidityPool.reserveA];

        const oldPrice: number = Number(reserveIn) / Number(reserveOut);
        const newPrice: number = Number(reserveIn + swapInAmount) / Number(reserveOut - estimatedReceive);
        const test: number = Number(swapInAmount)/ Number(estimatedReceive);

        return (newPrice - test) / test * 100;
    }

}