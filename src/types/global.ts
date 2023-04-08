import { LiquidityPool } from '../dex/models/liquidity-pool';

export type DexterResponse = {
    [dex: string]: LiquidityPool[],
}