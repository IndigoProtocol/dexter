import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios from 'axios';
import { VyFinance } from '../vyfinance';

export class VyfinanceApi extends BaseApi {

    protected readonly apiUrl: string;
    protected readonly dex: VyFinance;

    constructor(dex: VyFinance) {
        super();

        this.apiUrl = 'https://api.vyfi.io';
        this.dex = dex;
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
            ? `${this.apiUrl}/lp?networkId=1&tokenA=${assetAName}&tokenB=${assetBName}`
            : `${this.apiUrl}/lp?networkId=1&tokenA=${assetAName}`;

        return axios.get(url)
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