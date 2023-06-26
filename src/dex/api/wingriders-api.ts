import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { tokensMatch } from '@app/utils';
import { RequestConfig } from '@app/types';
import { WingRiders } from '@dex/wingriders';

export class WingRidersApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: WingRiders;

    constructor(dex: WingRiders, requestConfig: RequestConfig) {
        super();

        this.dex = dex;
        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${requestConfig.proxyUrl}https://api.mainnet.wingriders.com/graphql`
        });
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return this.api.post('', {
            operationName: 'LiquidityPoolsWithMarketData',
            query: `
                query LiquidityPoolsWithMarketData($input: PoolsWithMarketdataInput) {
                    poolsWithMarketdata(input: $input) {
                        ...LiquidityPoolFragment
                    }
                }
                fragment LiquidityPoolFragment on PoolWithMarketdata {
                    issuedShareToken {
                        policyId
                        assetName
                        quantity
                    }
                    tokenA {
                        policyId
                        assetName
                        quantity
                    }
                    tokenB {
                        policyId
                        assetName
                        quantity
                    }
                    treasuryA
                    treasuryB
                }
            `,
            variables: {
                input: {
                    sort: true
                },
            },
        }).then((response: any) => {
            return response.data.data.poolsWithMarketdata.map((pool: any) => {
                const tokenA: Token = pool.tokenA.policyId !== ''
                    ? new Asset(pool.tokenA.policyId, pool.tokenA.assetName)
                    : 'lovelace';
                const tokenB: Token = pool.tokenB.policyId !== ''
                    ? new Asset(pool.tokenB.policyId, pool.tokenB.assetName)
                    : 'lovelace';

                let liquidityPool: LiquidityPool = new LiquidityPool(
                    this.dex.name,
                    tokenA,
                    tokenB,
                    BigInt(pool.treasuryA),
                    BigInt(pool.treasuryB),
                    '', // todo unavailable
                    this.dex.orderAddress,
                    this.dex.orderAddress,
                );

                liquidityPool.lpToken = new Asset(pool.issuedShareToken.policyId, pool.issuedShareToken.assetName);
                liquidityPool.totalLpTokens = BigInt(pool.issuedShareToken.quantity);
                liquidityPool.poolFeePercent = 0.35;

                return liquidityPool;
            }).filter((pool: LiquidityPool | undefined) => pool !== undefined);
        });
    }

}
