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
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://api.sundae.fi/graphql`,
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
        const assets: string[] = [assetAId, assetBId];

        return await this.api.post('', {
            operationName: 'fetchPoolsByPair',
            query: `query fetchPoolsByPair($assetA: ID!, $assetB: ID!) {\n  pools {\n    byPair(assetA: $assetA, assetB: $assetB) {\n      ...PoolBrambleFragment\n    }\n  }\n}\n\nfragment PoolBrambleFragment on Pool {\n  id\n  assetA {\n    ...AssetBrambleFragment\n  }\n  assetB {\n    ...AssetBrambleFragment\n  }\n  assetLP {\n    ...AssetBrambleFragment\n  }\n  feesFinalized {\n    slot\n  }\n  marketOpen {\n    slot\n  }\n  askFee\n  bidFee\n  feeManagerId\n  current {\n    quantityA {\n      quantity\n    }\n    quantityB {\n      quantity\n    }\n    quantityLP {\n      quantity\n    }\n    tvl {\n      quantity\n    }\n  }\n  version\n}\n\nfragment AssetBrambleFragment on Asset {\n  id\n  policyId\n  description\n  dateListed {\n    format\n  }\n  decimals\n  ticker\n  name\n  logo\n  assetName\n  metadata {\n    ... on OnChainLabel20 {\n      __typename\n    }\n    ... on OnChainLabel721 {\n      __typename\n    }\n    ... on CardanoTokenRegistry {\n      __typename\n    }\n  }\n}`,
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
                        BigInt(pool.current.quantityA.quantity),
                        BigInt(pool.current.quantityB.quantity),
                        this.dex.poolAddress,
                        '',
                        '',
                    );

                    liquidityPool.identifier = pool.id;
                    liquidityPool.lpToken = Asset.fromIdentifier(pool.assetLP.id);
                    liquidityPool.poolFeePercent = Number((pool.bidFee[0] / pool.bidFee[1]) * 100);
                    liquidityPool.totalLpTokens = BigInt(pool.current.quantityLP.quantity);

                    return liquidityPool;
                });
        });

    }

}
