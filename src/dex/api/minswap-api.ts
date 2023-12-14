import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { Minswap } from '../minswap';
import { RequestConfig } from '@app/types';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { appendSlash } from '@app/utils';

const AES_KEY: string = '22eaca439bfd89cf125827a7a33fe3970d735dbfd5d84f19dd95820781fc47be';

export class MinswapApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: Minswap;

    constructor(dex: Minswap, requestConfig: RequestConfig) {
        super();

        this.dex = dex;

        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://monorepo-mainnet-prod.minswap.org/graphql`,
            withCredentials: false,
        });
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        // Small optimization for providing both tokens
        if (assetA && assetB) {
            return this.poolsByPair(assetA, assetB)
                .then((pool: LiquidityPool) => [pool]);
        }

        const maxPerPage: number = 20;

        const getPaginatedResponse = (page: number): Promise<LiquidityPool[]> => {
            return this.api.post('', {
                operationName: 'PoolsByAsset',
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
                        tokenName: assetA === 'lovelace' ? '' : assetA.nameHex,
                    },
                    limit: maxPerPage,
                    offset: page * maxPerPage,
                },
            }).then((response: any) => {
                response = JSON.parse(this.decryptResponse(response.data.data.encryptedData));

                const pools = response.poolsByAsset;

                const liquidityPools = pools.map((pool: any) => this.liquidityPoolFromResponse(pool));

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

    private poolsByPair(assetA: Token, assetB: Token): Promise<LiquidityPool> {
        return this.api.post('', {
            operationName: 'PoolByPair',
            query: `
                query PoolByPair($pair: InputPoolByPair!) {
                    poolByPair(pair: $pair) {
                        assetA {
                            currencySymbol
                            tokenName
                            isVerified
                            ...allMetadata
                        }
                        assetB {
                            currencySymbol
                            tokenName
                            isVerified
                            ...allMetadata
                        }
                        reserveA
                        reserveB
                        lpAsset {
                            currencySymbol
                            tokenName
                        }
                        totalLiquidity
                        profitSharing {
                            feeTo
                        }
                    }
                }
                fragment allMetadata on Asset {
                    metadata {
                        name
                        ticker
                        url
                        decimals
                        description
                    }
                }
            `,
            variables: {
                pair: {
                    assetA: {
                        currencySymbol: assetA === 'lovelace' ? '' : assetA.policyId,
                        tokenName: assetA === 'lovelace' ? '' : assetA.nameHex,
                    },
                    assetB: {
                        currencySymbol: assetB === 'lovelace' ? '' : assetB.policyId,
                        tokenName: assetB === 'lovelace' ? '' : assetB.nameHex,
                    },
                },
            },
        }).then((response: any) => {
            response = JSON.parse(this.decryptResponse(response.data.data.encryptedData));

            return this.liquidityPoolFromResponse(response.poolByPair)
        });
    }

    private liquidityPoolFromResponse(poolData: any): LiquidityPool {
        const liquidityPool: LiquidityPool = new LiquidityPool(
            Minswap.identifier,
            poolData.assetA.currencySymbol !== ''
                ? new Asset(poolData.assetA.currencySymbol, poolData.assetA.tokenName, poolData.assetA.metadata?.decimals ?? 0)
                : 'lovelace',
            poolData.assetB.currencySymbol !== ''
                ? new Asset(poolData.assetB.currencySymbol, poolData.assetB.tokenName, poolData.assetB.metadata?.decimals ?? 0)
                : 'lovelace',
            BigInt(poolData.reserveA),
            BigInt(poolData.reserveB),
            '', // Not provided
            this.dex.marketOrderAddress,
            this.dex.limitOrderAddress,
        );

        liquidityPool.lpToken = new Asset(poolData.lpAsset.currencySymbol, poolData.lpAsset.tokenName);
        liquidityPool.totalLpTokens = BigInt(poolData.totalLiquidity);
        liquidityPool.poolFeePercent = 0.3;
        liquidityPool.identifier = liquidityPool.lpToken.identifier();

        return liquidityPool;
    }

    private decryptResponse(encryptedResponse: string): any {
        return AES.decrypt(encryptedResponse, AES_KEY).toString(Utf8);
    }

}
