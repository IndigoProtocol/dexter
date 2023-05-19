import { BaseApi } from './base-api';
import { Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';

export class MuesliSwapApi extends BaseApi {

    protected readonly apiUrl: string;

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return Promise.resolve([]);
    }

}