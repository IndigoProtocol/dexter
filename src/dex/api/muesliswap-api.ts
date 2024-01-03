import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { MuesliSwap } from '../muesliswap';
import { RequestConfig } from '@app/types';
import { appendSlash } from '@app/utils';

export class MuesliSwapApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: MuesliSwap;

    constructor(dex: MuesliSwap, requestConfig: RequestConfig) {
        super();

        this.dex = dex;
        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://api.muesliswap.com/`,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const providers: string[] = ['muesliswap', 'muesliswap_v2', 'muesliswap_clp'];
        const tokenA: string = (assetA === 'lovelace')
            ? '.'
            : assetA.identifier('.');
        const tokenB: string = (assetB && assetB !== 'lovelace')
            ? assetB.identifier('.')
            : '';

        return this.api.get(`/liquidity/pools?providers=${providers.join(',')}&token-a=${tokenA}&token-b=${tokenB}`)
            .then((response: any) => {
                return response.data.map((pool: any) => {
                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        MuesliSwap.identifier,
                        pool.tokenA.symbol !== 'ADA'
                            ? new Asset(pool.tokenA.address.policyId, pool.tokenA.address.name, pool.tokenA.decimalPlaces)
                            : 'lovelace',
                        pool.tokenB.symbol !== 'ADA'
                            ? new Asset(pool.tokenB.address.policyId, pool.tokenB.address.name, pool.tokenB.decimalPlaces)
                            : 'lovelace',
                        BigInt(pool.tokenA.amount),
                        BigInt(pool.tokenB.amount),
                        pool.batcherAddress,
                        this.dex.orderAddress,
                        this.dex.orderAddress,
                    );

                    liquidityPool.identifier = pool.poolId;
                    liquidityPool.lpToken = new Asset(pool.lpToken.address.policyId, pool.lpToken.address.name);
                    liquidityPool.poolFeePercent = Number(pool.poolFee);
                    liquidityPool.totalLpTokens = BigInt(pool.lpToken.amount);

                    return liquidityPool;
                });
            });
    }

}
