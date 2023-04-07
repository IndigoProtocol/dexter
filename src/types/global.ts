import { LiquidityPool } from '../dex/models/liquidity-pool';

export type BlockfrostConfig = {
    url: string,
    projectId: string,
};

export type DexterResponse = {
    [dex: string]: LiquidityPool[],
}