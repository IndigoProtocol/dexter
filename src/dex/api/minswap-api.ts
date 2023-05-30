import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios from 'axios';
import { Minswap } from '../minswap';

export class MinswapApi extends BaseApi {

    protected readonly apiUrl: string;
    protected readonly dex: Minswap;

    constructor(dex: Minswap) {
        super();

        this.apiUrl = 'https://monorepo-mainnet-prod.minswap.org/graphql';
        this.dex = dex;
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const maxPerPage: number = 20;

        const getPaginatedResponse = (page: number): Promise<LiquidityPool[]> => {
            return axios.post(`${this.apiUrl}?PoolsByAsset`, {
                query: `
                    query PoolsByAsset($asset: InputAsset!, $limit: Int, $offset: Int) {
                        poolsByAsset(
                            asset: $asset
                            limit: $limit
                            offset: $offset
                        ) {
                            assetA {
                                currencySymbol
                                tokenName
                                ...allMetadata
                            }
                            assetB {
                                currencySymbol
                                tokenName
                                ...allMetadata
                            }
                            reserveA
                            reserveB
                            lpAsset {
                                currencySymbol
                                tokenName
                            }
                            totalLiquidity
                        }
                    }
                    fragment allMetadata on Asset {
                        metadata {
                            name
                            decimals
                        }
                    }
                `,
                variables: {
                    asset: {
                        currencySymbol: assetA === 'lovelace' ? '' : assetA.policyId,
                        tokenName: assetA === 'lovelace' ? '' : assetA.assetNameHex,
                    },
                    limit: maxPerPage,
                    offset: page * maxPerPage,
                },
            }).then((response: any) => {
                const pools = response.data.data.poolsByAsset;
                const liquidityPools = pools.map((pool: any) => {
                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        this.dex.name,
                        this.dex.poolAddress,
                        pool.assetA.currencySymbol !== ''
                            ? new Asset(pool.assetA.currencySymbol, pool.assetA.tokenName, pool.assetA.metadata?.decimals ?? 0)
                            : 'lovelace',
                        pool.assetB.currencySymbol !== ''
                            ? new Asset(pool.assetB.currencySymbol, pool.assetB.tokenName, pool.assetB.metadata?.decimals ?? 0)
                            : 'lovelace',
                        BigInt(pool.reserveA),
                        BigInt(pool.reserveB),
                    );

                    liquidityPool.lpToken = new Asset(pool.lpAsset.currencySymbol, pool.lpAsset.tokenName);
                    liquidityPool.totalLpTokens = BigInt(pool.totalLiquidity);
                    liquidityPool.poolFeePercent = 0.3;

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