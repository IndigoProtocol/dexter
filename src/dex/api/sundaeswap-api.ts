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
        const assetAId: string = assetA === 'lovelace'
            ? ''
            : assetA.id('.');

        const getPaginatedResponse = (page: number): Promise<LiquidityPool[]> => {
            return axios.post(this.apiUrl, {
                operationName: 'getPoolsByAssetIds',
                query: "query getPoolsByAssetIds($assetIds: [String!]!, $pageSize: Int, $page: Int) {\n  pools(assetIds: $assetIds, pageSize: $pageSize, page: $page) {\n    ...PoolFragment\n  }\n}\n\nfragment PoolFragment on Pool {\n  apr\n  rewards {\n    apr\n    asset {\n      ...AssetFragment\n    }\n  }\n  assetA {\n    ...AssetFragment\n  }\n  assetB {\n    ...AssetFragment\n  }\n  assetLP {\n    ...AssetFragment\n  }\n  name\n  fee\n  fees24H\n  quantityA\n  quantityB\n  quantityLP\n  ident\n  assetID\n}\n\nfragment AssetFragment on Asset {\n  assetId\n  policyId\n  assetName\n  decimals\n  logo\n  ticker\n  dateListed\n  marketCap\n  sources\n  priceToday\n  priceYesterday\n  priceDiff24H\n  poolId\n  slotAdded\n  totalSupply\n  tvl\n  tvlDiff24H\n  tvlToday\n  tvlYesterday\n  volume24H\n}",
                variables: {
                    page: page,
                    pageSize: maxPerPage,
                    assetIds: assetB
                        ? [
                            assetAId,
                            assetB === 'lovelace'
                                ? ''
                                : assetB.id('.')
                        ]
                        : [assetAId],
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

                return getPaginatedResponse(page + 1).then(nextPagePools => {
                    return liquidityPools.concat(nextPagePools);
                });
            });
        };

        return getPaginatedResponse(0);
    }

}