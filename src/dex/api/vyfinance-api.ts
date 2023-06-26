import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { VyFinance } from '../vyfinance';
import { RequestConfig } from '@app/types';
import { tokensMatch } from '@app/utils';

export class VyfinanceApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: VyFinance;

    constructor(dex: VyFinance, requestConfig: RequestConfig) {
        super();

        this.dex = dex;
        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${requestConfig.proxyUrl}https://api.vyfi.io`
        });
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        return this.api.get('/lp?networkId=1&v2=true')
            .then((poolResponse: any) => {
                return poolResponse.data.map((pool: any) => {
                    const poolDetails: any = JSON.parse(pool.json);

                    const tokenA: Token = poolDetails['aAsset']['tokenName']
                        ? new Asset(poolDetails['aAsset']['currencySymbol'], Buffer.from(poolDetails['aAsset']['tokenName']).toString('hex'))
                        : 'lovelace';
                    const tokenB: Token = poolDetails['bAsset']['tokenName']
                        ? new Asset(poolDetails['bAsset']['currencySymbol'], Buffer.from(poolDetails['bAsset']['tokenName']).toString('hex'))
                        : 'lovelace';

                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        this.dex.name,
                        tokenA,
                        tokenB,
                        pool['tokenAQuantity'],
                        pool['tokenBQuantity'],
                        pool['poolValidatorUtxoAddress'],
                        pool['orderValidatorUtxoAddress'],
                        pool['orderValidatorUtxoAddress'],
                    );

                    const lpTokenDetails: string[] = pool['lpPolicyId-assetId'].split('-');
                    liquidityPool.lpToken = new Asset(lpTokenDetails[0], lpTokenDetails[1]);
                    liquidityPool.poolFeePercent = (poolDetails['feesSettings']['barFee'] + poolDetails['feesSettings']['liqFee']) / 100;

                    return liquidityPool;
                }).filter((pool: LiquidityPool | undefined) => pool !== undefined) as LiquidityPool[];
            }).catch(() => {
                return [];
            });
    }

}
