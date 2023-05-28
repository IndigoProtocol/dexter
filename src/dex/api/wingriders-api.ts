import { BaseApi } from './base-api';
import { Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import { BaseDex } from '../base-dex';

export class WingRidersApi extends BaseApi {

    protected readonly apiUrl: string;
    protected readonly dex: BaseDex;

    constructor(dex: BaseDex) {
        super();

        this.apiUrl = 'https://api.mainnet.wingriders.com/graphql';
        this.dex = dex;
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        //todo WingRiders blocks request. Need whitelisted domain
        return Promise.resolve([]);
    }

}