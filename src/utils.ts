import { Token } from './dex/models/asset';

export function tokensMatch(tokenA: Token, tokenB: Token): boolean {
    const tokenAId: string = tokenA === 'lovelace' ? 'lovelace' : tokenA.id();
    const tokenBId: string = tokenB === 'lovelace' ? 'lovelace' : tokenB.id();

    return tokenAId === tokenBId;
}