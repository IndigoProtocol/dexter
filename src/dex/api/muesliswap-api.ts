import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios from 'axios';
import { MuesliSwap } from '../muesliswap';

export class MuesliSwapApi extends BaseApi {

    protected readonly apiUrl: string;
    protected readonly dex: MuesliSwap;

    constructor(dex: MuesliSwap) {
        super();

        this.apiUrl = 'https://api.muesliswap.com/';
        this.dex = dex;
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const providers: string[] = ['muesliswap', 'muesliswap_v2', 'muesliswap_clp'];
        const tokenA: string = (assetA === 'lovelace')
            ? '.'
            : assetA.id('.')
        const tokenB: string = (assetB && assetB !== 'lovelace')
            ? assetB.id('.')
            : ''

        return axios.get(`${this.apiUrl}/liquidity/pools?providers=${providers.join(',')}&token-a=${tokenA}&token-b=${tokenB}`)
            .then((response: any) => {
                return response.data.map((pool: any) => {
                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        this.dex.name,
                        this.dex.poolAddress,
                        pool.tokenA.symbol !== 'ADA'
                            ? new Asset(pool.tokenA.address.policyId, pool.tokenA.address.name, pool.tokenA.decimalPlaces)
                            : 'lovelace',
                        pool.tokenB.symbol !== 'ADA'
                            ? new Asset(pool.tokenB.address.policyId, pool.tokenB.address.name, pool.tokenB.decimalPlaces)
                            : 'lovelace',
                        BigInt(pool.tokenA.amount),
                        BigInt(pool.tokenB.amount),
                    );

                    liquidityPool.identifier = pool.poolId;
                    liquidityPool.lpToken = new Asset(pool.lpToken.address.policyId, pool.lpToken.address.name);
                    liquidityPool.totalLpTokens = BigInt(pool.lpToken.amount);
                    liquidityPool.poolFeePercent = Number(pool.poolFee);

                    return liquidityPool;
                })
            });
    }

}