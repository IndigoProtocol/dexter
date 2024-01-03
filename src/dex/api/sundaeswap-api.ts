import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { SundaeSwap } from '../sundaeswap';
import { RequestConfig } from '@app/types';
import { appendSlash } from '@app/utils';

export class SundaeSwapApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: SundaeSwap;

    constructor(dex: SundaeSwap, requestConfig: RequestConfig) {
        super();

        this.dex = dex;
        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://stats.sundaeswap.finance/graphql`,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const maxPerPage: number = 100;

        const assetAId: string = (assetA === 'lovelace')
            ? ''
            : assetA.identifier('.');
        let assetBId: string = (assetB && assetB !== 'lovelace')
            ? assetB.identifier('.')
            : '';

        const getPaginatedResponse = (page: number): Promise<LiquidityPool[]> => {
            return this.api.post('', {
                operationName: 'getPoolsByAssetIds',
                query: `
                    query getPoolsByAssetIds($assetIds: [String!]!, $pageSize: Int, $page: Int) {
                        pools(assetIds: $assetIds, pageSize: $pageSize, page: $page) {
                            ...PoolFragment
                        }
                    }
                    fragment PoolFragment on Pool {
                        assetA {
                            ...AssetFragment
                        }
                        assetB {
                            ...AssetFragment
                        }
                        assetLP {
                            ...AssetFragment
                        }
                        name
                        fee
                        quantityA
                        quantityB
                        quantityLP
                        ident
                        assetID
                    }
                    fragment AssetFragment on Asset {
                        assetId
                        decimals
                    }
                `,
                variables: {
                    page: page,
                    pageSize: maxPerPage,
                    assetIds: [assetBId !== '' ? assetBId : assetAId],
                },
            }).then((response: any) => {
                const pools = response.data.data.pools;
                const liquidityPools = pools.map((pool: any) => {
                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        SundaeSwap.identifier,
                        pool.assetA.assetId
                            ? Asset.fromIdentifier(pool.assetA.assetId, pool.assetA.decimals)
                            : 'lovelace',
                        pool.assetB.assetId
                            ? Asset.fromIdentifier(pool.assetB.assetId, pool.assetB.decimals)
                            : 'lovelace',
                        BigInt(pool.quantityA),
                        BigInt(pool.quantityB),
                        this.dex.poolAddress,
                        this.dex.orderAddress,
                        this.dex.orderAddress,
                    );

                    liquidityPool.identifier = pool.ident;
                    liquidityPool.lpToken = Asset.fromIdentifier(pool.assetLP.assetId);
                    liquidityPool.poolFeePercent = Number(pool.fee);
                    liquidityPool.totalLpTokens = BigInt(pool.quantityLP);

                    return liquidityPool;
                });

                if (pools.length < maxPerPage) {
                    return liquidityPools;
                }

                return getPaginatedResponse(page + 1).then((nextPagePools: LiquidityPool[]) => {
                    return liquidityPools.concat(nextPagePools);
                });
            });
        };

        return getPaginatedResponse(0);
    }

}
