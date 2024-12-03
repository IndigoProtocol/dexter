import { BaseApi } from './base-api';
import { Asset, Token } from '../models/asset';
import { LiquidityPool } from '../models/liquidity-pool';
import axios, { AxiosInstance } from 'axios';
import { RequestConfig } from '@app/types';
import { appendSlash } from '@app/utils';
import { Splash } from '@dex/splash';

const MAX_INT: bigint = 9_223_372_036_854_775_807n;

export class SplashApi extends BaseApi {

    protected readonly api: AxiosInstance;
    protected readonly dex: Splash;

    constructor(dex: Splash, requestConfig: RequestConfig) {
        super();

        this.dex = dex;

        this.api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://api5.splash.trade/platform-api/v1/`,
            withCredentials: false,
        });
    }

    async liquidityPools(assetA: Token, assetB?: Token): Promise<LiquidityPool[]> {
        const assets: any = (await this.assets()).data['tokens'];

        return this.api.get('/pools/overview?verified=false&duplicated=false').then((response: any) => {
            return response.data.map((pool: any) => this.liquidityPoolFromResponse(pool, assets)) as LiquidityPool[];
        });
    }

    private liquidityPoolFromResponse(poolData: any, assets: any): LiquidityPool {
        poolData = poolData.pool;

        const tokenA: Token = poolData.x.asset === '.'
            ? 'lovelace'
            : new Asset(poolData.x.asset.split('.')[0], poolData.x.asset.split('.')[1]);
        const tokenB = poolData.y.asset === '.'
            ? 'lovelace'
            : new Asset(poolData.y.asset.split('.')[0], poolData.y.asset.split('.')[1]);

        if (tokenA !== 'lovelace' && tokenA.identifier('.') in assets) {
            tokenA.decimals = assets[tokenA.identifier('.')].decimals;
        }
        if (tokenB !== 'lovelace' && tokenB.identifier('.') in assets) {
            tokenB.decimals = assets[tokenB.identifier('.')].decimals;
        }

        const liquidityPool: LiquidityPool = new LiquidityPool(
            Splash.identifier,
            tokenA,
            tokenB,
            BigInt(poolData['x']['amount']) - BigInt(poolData['treasuryX']),
            BigInt(poolData['y']['amount']) - BigInt(poolData['treasuryY']),
            '',
            '',
            '',
        );

        const [lpTokenPolicyId, lpTokenAssetName] = poolData['lq']['asset'].split('.');

        liquidityPool.lpToken = new Asset(lpTokenPolicyId, lpTokenAssetName);
        liquidityPool.totalLpTokens = MAX_INT - BigInt(poolData['lq']['amount']);
        liquidityPool.identifier = poolData['id'];

        return liquidityPool;
    }

    private assets(): Promise<any> {
        return axios.get('https://spectrum.fi/cardano-token-list-v2.json');
    }

}
