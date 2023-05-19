import { Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';

export abstract class BaseApi {

    protected abstract readonly apiUrl: string;

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     */
    abstract liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]>;

}