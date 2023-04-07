import { LiquidityPool } from './models/liquidity-pool';
import { Asset } from '../types/dex';

export abstract class BaseDex {

    abstract readonly name: string;

    abstract liquidityPool(assetA: Asset, assetB: Asset): Promise<LiquidityPool>;

    abstract liquidityPools(): Promise<LiquidityPool[]>;

    abstract orders(): void;

    abstract submitSwap(): void;

}