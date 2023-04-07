import { BaseDex } from './base-dex';
import { LiquidityPool } from './models/liquidity-pool';
import { Asset } from '../types/dex';

export class Minswap extends BaseDex {

    name = 'Minswap';

    liquidityPool(assetA: Asset, assetB: Asset): Promise<LiquidityPool> {
        return Promise.resolve(new LiquidityPool(this.name, 'lovelace', 'lovelace', 0n, 0n));
    }

    liquidityPools(): Promise<LiquidityPool[]> {
        return Promise.resolve([]);
    }

    orders(): void {
    }

    submitSwap(): void {
    }

}