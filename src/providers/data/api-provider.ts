import { ApiProviderConfig } from '../../types';
import { LiquidityPool } from '../../dex/models/liquidity-pool';
import { Token } from '../../dex/models/asset';
import { BaseApi } from '../../dex/api/base-api';
import { MinswapApi } from '../../dex/api/minswap-api';
import { SundaeSwapApi } from '../../dex/api/sundaeswap-api';
import { MuesliSwapApi } from '../../dex/api/muesliswap-api';
import { WingRidersApi } from '../../dex/api/wingriders-api';
import { VyfinanceApi } from '../../dex/api/vyfinance-api';

export class ApiProvider {

    private _config: ApiProviderConfig;
    public _apis: BaseApi[];

    constructor(config: ApiProviderConfig) {
        this._config = config;
        this._apis = [
            new MinswapApi(),
            new SundaeSwapApi(),
            new MuesliSwapApi(),
            new WingRidersApi(),
            new VyfinanceApi(),
        ];
    }

    public getLiquidityPools(assetA: Token = 'lovelace', assetB?: Token): Promise<LiquidityPool[]> {
        return Promise.all(
            this._apis.map((api: BaseApi) => {
                return api.liquidityPools(assetA, assetB);
            })
        ).then((liquidityPools: LiquidityPool[][]) => liquidityPools.flat());
    }

    public getLiquidityPoolHistory(liquidityPool: LiquidityPool): Promise<LiquidityPool[]> {
        return Promise.resolve([]);
    }

}