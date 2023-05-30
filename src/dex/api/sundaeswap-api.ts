import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios from 'axios';
import { SundaeSwap } from '../sundaeswap';

export class SundaeSwapApi extends BaseApi {

    protected readonly apiUrl: string;
    protected readonly dex: SundaeSwap;

    constructor(dex: SundaeSwap) {
        super();

        this.apiUrl = 'https://stats.sundaeswap.finance/graphql';
        this.dex = dex;
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const maxPerPage: number = 100;

        const getPaginatedResponse = (page: number): Promise<LiquidityPool[]> => {
            return axios.post(this.apiUrl, {
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
                    assetIds: [
                        (assetA === 'lovelace')
                            ? ''
                            : assetA.id('.'),
                        (assetB && assetB !== 'lovelace')
                            ? assetB.id('.')
                            : ''
                    ],
                },
            }).then((response: any) => {
                const pools = response.data.data.pools;
                const liquidityPools = pools.map((pool: any) => {
                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        this.dex.name,
                        this.dex.poolAddress,
                        pool.assetA.assetId
                            ? Asset.fromId(pool.assetA.assetId, pool.assetA.decimals)
                            : 'lovelace',
                        pool.assetB.assetId
                            ? Asset.fromId(pool.assetB.assetId, pool.assetB.decimals)
                            : 'lovelace',
                        BigInt(pool.quantityA),
                        BigInt(pool.quantityB),
                    );

                    liquidityPool.identifier = pool.ident;
                    liquidityPool.lpToken = Asset.fromId(pool.assetLP.assetId);
                    liquidityPool.totalLpTokens = BigInt(pool.quantityLP);
                    liquidityPool.poolFeePercent = Number(pool.fee);

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