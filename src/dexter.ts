import { BaseProvider } from './provider/base-provider';
import { TokenRegistry } from './services/token-registry';
import { DexterRequest } from './dexter-request';
import { AvailableDexs, DexterConfig } from './types';
import { Minswap } from './dex/minswap';
import { SundaeSwap } from './dex/sundaeswap';
import { MuesliSwap } from './dex/muesliswap';
import { WingRiders } from './dex/wingriders';
import { LiquidityPool } from './dex/models/liquidity-pool';
import { Token } from './dex/models/asset';
import { SwapTransaction } from './dex/swap-transaction';

export class Dexter {

    public provider: BaseProvider;
    public config: DexterConfig;

    public availableDexs: AvailableDexs;
    public tokenRegistry: TokenRegistry;

    constructor(provider: BaseProvider, config: DexterConfig = {}) {
        this.provider = provider;
        this.config = config;
        this.tokenRegistry = new TokenRegistry();
        this.availableDexs = {
            [Minswap.name]: new Minswap(),
            [SundaeSwap.name]: new SundaeSwap(),
            [MuesliSwap.name]: new MuesliSwap(),
            [WingRiders.name]: new WingRiders(),
        };
    }

    /**
     * Set config Dexter will use for all requests.
     */
    setConfig(config: DexterConfig = {}): Dexter {
        this.config = config;

        return this;
    }

    /**
     * Switch to a new provider.
     */
    switchProvider(provider: BaseProvider): Dexter {
        this.provider = provider;

        return this;
    }

    /**
     * New request for data fetching.
     */
    newFetchRequest(): DexterRequest {
        return new DexterRequest(this);
    }

    newSwapRequest(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint) {
        if (! Object.keys(this.availableDexs).includes(liquidityPool.dex)) {
            throw new Error(`DEX ${liquidityPool.dex} provided with the liquidity pool is not available.`);
        }

        return new SwapTransaction(liquidityPool, swapInToken, swapInAmount);
    }

    // submitSwap - order ^

}