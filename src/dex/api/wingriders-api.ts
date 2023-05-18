import { BaseApi } from './base-api';
import { Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';

export class WingRidersApi extends BaseApi {

    private readonly apiUrl: string;

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return Promise.resolve([]);
    }

}