import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { RequestConfig } from '@app/types';
import { appendSlash } from '@app/utils';
import { SundaeSwapV3 } from '@dex/sundaeswap-v3';

export class SundaeSwapV3Api extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: SundaeSwapV3;

    constructor(dex: SundaeSwapV3, requestConfig: RequestConfig) {
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

    async liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const assetAId: string = (assetA === 'lovelace')
            ? 'ada.lovelace'
            : assetA.identifier('.');
        const assetBId: string = (assetB && assetB !== 'lovelace')
            ? assetB.identifier('.')
            : 'ada.lovelace';
        const assets: string[] = [assetAId, assetBId].sort();

        return await this.api.post('', {
            operationName: 'fetchPoolsByPair',
            query: `
                query fetchPoolsByPair($assetA: ID!, $assetB: ID!) { 
                    pools {
                        byPair(assetA: $assetA, assetB: $assetB) {
                            ...PoolBrambleFragment
                        }
                    }
                }
                fragment PoolBrambleFragment on Pool {
                  id
                  assetA {
                    ...AssetBrambleFragment
                  }
                  assetB {
                    ...AssetBrambleFragment
                  }
                  assetLP {
                    ...AssetBrambleFragment
                  }
                  feesFinalized {
                    slot
                  }
                  marketOpen {
                    slot
                  }
                  openingFee
                  finalFee
                  current {
                    quantityA {
                      quantity
                    }
                    quantityB {
                      quantity
                    }
                    quantityLP {
                      quantity
                    }
                    tvl {
                      quantity
                    }
                  }
                  version
                }
                fragment AssetBrambleFragment on Asset {
                  id
                  decimals
                }
            `,
            variables: {
                assetA: assets[0],
                assetB: assets[1],
            },
        }).then((response: any) => {
            const pools = response.data.data.pools.byPair;

            return pools
                .filter((pool: any) => pool.version === 'V3')
                .map((pool: any) => {
                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        SundaeSwapV3.identifier,
                        pool.assetA.id === 'ada.lovelace'
                            ? 'lovelace'
                            : Asset.fromIdentifier(pool.assetA.id, pool.assetA.decimals),
                        pool.assetB.id === 'ada.lovelace'
                            ? 'lovelace'
                            : Asset.fromIdentifier(pool.assetB.id, pool.assetB.decimals),
                        BigInt(pool.current.quantityA),
                        BigInt(pool.current.quantityB),
                        this.dex.poolAddress,
                        this.dex.getDynamicOrderAddress(''), // TODO Need to get sender stake key hash.
                        this.dex.getDynamicOrderAddress(''), // TODO Need to get sender stake key hash.
                    );

                    liquidityPool.identifier = pool.id;
                    liquidityPool.lpToken = Asset.fromIdentifier(pool.assetLP.id);
                    liquidityPool.poolFeePercent = Number((pool.openingFee[0] / pool.openingFee[1]) * 100);
                    liquidityPool.totalLpTokens = BigInt(pool.current.quantityLP.quantity);

                    return liquidityPool;
                });
        });

    }

}
