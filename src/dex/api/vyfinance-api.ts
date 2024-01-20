import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { VyFinance } from '../vyfinance';
import { RequestConfig } from '@app/types';
import { appendSlash } from '@app/utils';

export class VyfinanceApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: VyFinance;

    constructor(dex: VyFinance, requestConfig: RequestConfig) {
        super();

        this.dex = dex;
        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://api.vyfi.io`,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    liquidityPools(assetA?: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const assetAId: string = (assetA && assetA !== 'lovelace')
            ? assetA.identifier()
            : 'lovelace';
        let assetBId: string = (assetB && assetB !== 'lovelace')
            ? assetB.identifier()
            : 'lovelace';

        const url: string = assetA && assetB
            ? `/lp?networkId=1&v2=true&tokenAUnit=${assetAId}&tokenBUnit=${assetBId}`
            : '/lp?networkId=1&v2=true';

        return this.api.get(url)
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
                        VyFinance.identifier,
                        tokenA,
                        tokenB,
                        BigInt(pool['tokenAQuantity'] ?? 0),
                        BigInt(pool['tokenBQuantity'] ?? 0),
                        pool['poolValidatorUtxoAddress'],
                        pool['orderValidatorUtxoAddress'],
                        pool['orderValidatorUtxoAddress'],
                    );

                    const lpTokenDetails: string[] = pool['lpPolicyId-assetId'].split('-');
                    liquidityPool.lpToken = new Asset(lpTokenDetails[0], lpTokenDetails[1]);
                    liquidityPool.poolFeePercent = (poolDetails['feesSettings']['barFee'] + poolDetails['feesSettings']['liqFee']) / 100;
                    liquidityPool.identifier = liquidityPool.lpToken.identifier();
                    liquidityPool.extra.nft = new Asset(poolDetails['mainNFT']['currencySymbol'], poolDetails['mainNFT']['tokenName']);

                    return liquidityPool;
                }).filter((pool: LiquidityPool | undefined) => pool !== undefined) as LiquidityPool[];
            }).catch((e) => {
                console.error(e)
                return [];
            });
    }

}
