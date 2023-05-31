import { Token } from '@dex/models/asset';
import { LiquidityPool } from '@dex/models/liquidity-pool';

export function tokensMatch(tokenA: Token, tokenB: Token): boolean {
    const tokenAId: string = tokenA === 'lovelace' ? 'lovelace' : tokenA.id();
    const tokenBId: string = tokenB === 'lovelace' ? 'lovelace' : tokenB.id();

    return tokenAId === tokenBId;
}

export function correspondingReserves(liquidityPool: LiquidityPool, tokenA: Token): bigint[] {
    return tokensMatch(tokenA, liquidityPool.assetA)
        ? [liquidityPool.reserveA, liquidityPool.reserveB]
        : [liquidityPool.reserveB, liquidityPool.reserveA]
}