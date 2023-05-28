import { BaseDataProvider } from './providers/data/base-data-provider';
import { TokenRegistry } from './services/token-registry';
import { FetchRequest } from './requests/fetch-request';
import { AvailableDexs, DexterConfig } from './types';
import { Minswap } from './dex/minswap';
import { SundaeSwap } from './dex/sundaeswap';
import { MuesliSwap } from './dex/muesliswap';
import { WingRiders } from './dex/wingriders';
import { SwapRequest } from './requests/swap-request';
import { BaseWalletProvider } from './providers/wallet/base-wallet-provider';
import { BaseDex } from './dex/base-dex';
import { CancelRequest } from './requests/cancel-request';
import { VyFinance } from './dex/vyfinance';

export class Dexter {

    public dataProvider?: BaseDataProvider;
    public walletProvider?: BaseWalletProvider;
    public config: DexterConfig;

    public availableDexs: AvailableDexs;
    public tokenRegistry: TokenRegistry;

    constructor(config: DexterConfig = {}, dataProvider: BaseDataProvider | undefined, walletProvider?: BaseWalletProvider) {
        this.config = config;
        this.dataProvider = dataProvider;
        this.walletProvider = walletProvider;

        this.tokenRegistry = new TokenRegistry();
        this.availableDexs = {
            [Minswap.name]: new Minswap(),
            [SundaeSwap.name]: new SundaeSwap(),
            [MuesliSwap.name]: new MuesliSwap(),
            [WingRiders.name]: new WingRiders(),
            [VyFinance.name]: new VyFinance(),
        };
    }

    public dexByName(name: string): BaseDex | undefined {
        return this.availableDexs[name];
    }

    /**
     * Switch to a new data provider.
     */
    public switchDataProvider(dataProvider: BaseDataProvider): Dexter {
        this.dataProvider = dataProvider;

        return this;
    }

    /**
     * Switch to a new wallet provider.
     */
    public switchWalletProvider(walletProvider: BaseWalletProvider): Dexter {
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
    public newSwapRequest(): SwapRequest {
        if (! this.walletProvider) {
            throw new Error('Please set a wallet provider before requesting a swap order.');
        }

        return new SwapRequest(this);
    }

    /**
     * New request for cancelling a swap order.
     */
    public newCancelRequest(): CancelRequest {
        if (! this.walletProvider) {
            throw new Error('Please set a wallet provider before requesting a cancel order.');
        }

        return new CancelRequest(this);
    }

}