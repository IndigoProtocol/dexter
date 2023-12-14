import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { RequestConfig } from '@app/types';
import { appendSlash, tokensMatch } from '@app/utils';
import { TeddySwap } from '@dex/teddyswap';

export class TeddyswapApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: TeddySwap;

    constructor(dex: TeddySwap, requestConfig: RequestConfig) {
        super();

        this.dex = dex;
        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://analytics.teddyswap.org/v1`,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return this.api.get('/front/pools', ).then((response: any) => {
            return response.data.map((poolResponse: any) => {
                const tokenA: Token = poolResponse.lockedX.asset.currencySymbol !== ''
                    ? new Asset(poolResponse.lockedX.asset.currencySymbol, Buffer.from(poolResponse.lockedX.asset.tokenName, 'utf8').toString('hex'))
                    : 'lovelace';
                const tokenB: Token = poolResponse.lockedY.asset.currencySymbol !== ''
                    ? new Asset(poolResponse.lockedY.asset.currencySymbol, Buffer.from(poolResponse.lockedY.asset.tokenName, 'utf8').toString('hex'))
                    : 'lovelace';

                if (! tokensMatch(tokenA, assetA) || (assetB && ! tokensMatch(tokenB, assetB))) {
                    return undefined;
                }
                console.log(tokenA, tokenB, assetA, assetB)
                let liquidityPool: LiquidityPool = new LiquidityPool(
                    TeddySwap.identifier,
                    tokenA,
                    tokenB,
                    BigInt(poolResponse.lockedX.amount),
                    BigInt(poolResponse.lockedY.amount),
                    '', // Not supplied
                    this.dex.orderAddress,
                    this.dex.orderAddress,
                );

                liquidityPool.lpToken = new Asset(poolResponse.lockedLQ.asset.currencySymbol, Buffer.from(poolResponse.lockedLQ.asset.tokenName, 'utf8').toString('hex'));
                liquidityPool.poolFeePercent = (1 - (poolResponse.poolFeeNum / poolResponse.poolFeeDenum)) * 10;
                liquidityPool.identifier = liquidityPool.lpToken.identifier();

                return liquidityPool;
            }).filter((pool: LiquidityPool | undefined) => pool !== undefined) as LiquidityPool[];
        });
    }

}
