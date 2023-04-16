import { LiquidityPool } from '../dex/models/liquidity-pool';
import { BaseDex } from '../dex/base-dex';
import { DatumKey } from '../constants';

export interface DexterConfig {
    shouldFetchMetadata?: false,
}

export type DexterResponse = {
    [dex: string]: LiquidityPool[],
}
export type AvailableDexs = {
    [dex: string]: BaseDex,
}

export type DatumParameters = {
    [key in DatumKey]?: string | number
}