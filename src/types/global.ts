import { LiquidityPool } from '../dex/models/liquidity-pool';
import { BaseDex } from '../dex/base-dex';

export interface DexterConfig {
    shouldFetchMetadata?: false,
}

export type DexterResponse = {
    [dex: string]: LiquidityPool[],
}
export type AvailableDexs = {
    [dex: string]: BaseDex,
}