import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { VyFinance } from '../vyfinance';
import { RequestConfig } from '../../types';

export class VyfinanceApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: VyFinance;

    constructor(dex: VyFinance, requestConfig: RequestConfig) {
        super();

        this.dex = dex;
        this.api = axios.create({
            baseURL: requestConfig.shouldUseRequestProxy
                ? 'https://cors-anywhere.herokuapp.com/https://api.vyfi.io'
                : 'https://api.vyfi.io',
        });
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        let assetAName: string = assetA === 'lovelace'
            ? 'ADA'
            : assetA.assetName;
        let assetBName: string = assetB === 'lovelace'
            ? 'ADA'
            : (assetB?.assetName ?? '');

        if (assetBName === 'lovelace') {
            [assetAName, assetBName] = [assetBName, assetAName];
        }

        const url: string = assetBName
            ? `/lp?networkId=1&tokenA=${assetAName}&tokenB=${assetBName}`
            : `/lp?networkId=1&tokenA=${assetAName}`;

        return this.api.get(url)
            .then((poolResponse: any) => {
                return poolResponse.data.map((pool: any) => {
                    const poolDetails: any = JSON.parse(pool.json);

                    let liquidityPool: LiquidityPool = new LiquidityPool(
                        this.dex.name,
                        pool['poolValidatorUtxoAddress'],
                        poolDetails['aAsset']['tokenName']
                            ? new Asset(poolDetails['aAsset']['currencySymbol'], poolDetails['aAsset']['tokenName'])
                            : 'lovelace',
                        poolDetails['bAsset']['tokenName']
                            ? new Asset(poolDetails['bAsset']['currencySymbol'], poolDetails['bAsset']['tokenName'])
                            : 'lovelace',
                        pool['tokenAQuantity'],
                        pool['tokenBQuantity'],
                    );

                    const lpTokenDetails: string[] = pool['lpPolicyId-assetId'].split('-');
                    liquidityPool.lpToken = new Asset(lpTokenDetails[0], lpTokenDetails[1]);
                    liquidityPool.totalLpTokens = BigInt(pool['lpQuantity']);
                    liquidityPool.poolFeePercent = (poolDetails['feeSettings']['barFee'] + poolDetails['feeSettings']['liqFee']) / 100;

                    return liquidityPool;
                }) as LiquidityPool[];
            }).catch(() => {
                return [];
            });
    }

}