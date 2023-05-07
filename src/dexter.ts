import { DataProvider } from './providers/data/data-provider';
import { TokenRegistry } from './services/token-registry';
import { FetchRequest } from './requests/fetch-request';
import { AvailableDexs, DexterConfig } from './types';
import { Minswap } from './dex/minswap';
import { SundaeSwap } from './dex/sundaeswap';
import { MuesliSwap } from './dex/muesliswap';
import { WingRiders } from './dex/wingriders';
import { SwapRequest } from './requests/swap-request';
import { WalletProvider } from './providers/wallet/wallet-provider';
import { BaseDex } from './dex/base-dex';
import { CancelRequest } from './requests/cancel-request';

export class Dexter {

    public dataProvider: DataProvider;
    public walletProvider?: WalletProvider;
    public config: DexterConfig;

    public availableDexs: AvailableDexs;
    public tokenRegistry: TokenRegistry;

    constructor(dataProvider: DataProvider, config: DexterConfig = {}, walletProvider?: WalletProvider) {
        this.dataProvider = dataProvider;
        this.config = config;
        this.walletProvider = walletProvider;

        this.tokenRegistry = new TokenRegistry();
        this.availableDexs = {
            [Minswap.name]: new Minswap(),
            [SundaeSwap.name]: new SundaeSwap(),
            [MuesliSwap.name]: new MuesliSwap(),
            [WingRiders.name]: new WingRiders(),
        };
    }

    public dexByName(name: string): BaseDex | undefined {
        return this.availableDexs[name];
    }

    /**
     * Switch to a new data provider.
     */
    public switchDataProvider(dataProvider: DataProvider): Dexter {
        this.dataProvider = dataProvider;

        return this;
    }

    /**
     * Switch to a new wallet provider.
     */
    public switchWalletProvider(walletProvider: WalletProvider): Dexter {
        this.walletProvider = walletProvider;

        return this;
    }

    /**
     * New request for data fetching.
     */
    public newFetchRequest(): FetchRequest {
        return new FetchRequest(this);
    }

    /**
     * New request for a swap order.
     */
    public newSwapRequest() {
        return new SwapRequest(this);
    }

    /**
     * New request for cancelling a swap order.
     */
    public newCancelRequest() {
        return new CancelRequest(this);
    }

}