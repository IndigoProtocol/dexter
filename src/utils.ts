import { Token } from '@dex/models/asset';
import { LiquidityPool } from '@dex/models/liquidity-pool';

export function tokensMatch(tokenA: Token, tokenB: Token): boolean {
    const tokenAId: string = tokenA === 'lovelace' ? 'lovelace' : tokenA.identifier();
    const tokenBId: string = tokenB === 'lovelace' ? 'lovelace' : tokenB.identifier();

    return tokenAId === tokenBId;
}

export function correspondingReserves(liquidityPool: LiquidityPool, token: Token): bigint[] {
    return tokensMatch(token, liquidityPool.assetA)
        ? [liquidityPool.reserveA, liquidityPool.reserveB]
        : [liquidityPool.reserveB, liquidityPool.reserveA]
}

export function appendSlash(value?: string) {
    if (! value) return '';
    if (value.endsWith('/')) return;

    return `${value}/`;
}
