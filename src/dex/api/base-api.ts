import { Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import { BaseDex } from '../base-dex';
import { AxiosInstance } from 'axios';

export abstract class BaseApi {

    protected abstract readonly api: AxiosInstance;
    protected abstract readonly dex: BaseDex;

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     */
    abstract liquidityPools(assetA?: Token, assetB?: Token): Promise<LiquidityPool[]>;

}
