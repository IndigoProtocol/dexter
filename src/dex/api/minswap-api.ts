import { BaseApi } from './base-api';
import { Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import { BaseDex } from '../base-dex';

export class MinswapApi extends BaseApi {

    protected readonly apiUrl: string;
    protected readonly dex: BaseDex;

    constructor(dex: BaseDex) {
        super();

        this.apiUrl = '';
        this.dex = dex;
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return Promise.resolve([]);
    }

}