import { LiquidityPool } from './models/liquidity-pool';
import { BaseProvider } from '../provider/base-provider';
import { Token } from './models/asset';

export abstract class BaseDex {

    public abstract readonly name: string;

    abstract liquidityPools(provider: BaseProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]>;

    abstract orders(): void;

    abstract submitSwap(): void;

}