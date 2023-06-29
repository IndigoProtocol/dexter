import { BaseDataProvider } from '@providers/data/base-data-provider';
import { AvailableDexs, DexterConfig, RequestConfig } from '@app/types';
import { Minswap } from '@dex/minswap';
import { SundaeSwap } from '@dex/sundaeswap';
import { MuesliSwap } from '@dex/muesliswap';
import { WingRiders } from '@dex/wingriders';
import { SwapRequest } from '@requests/swap-request';
import { BaseWalletProvider } from '@providers/wallet/base-wallet-provider';
import { BaseDex } from '@dex/base-dex';
import { VyFinance } from '@dex/vyfinance';
import { BaseMetadataProvider } from '@providers/asset-metadata/base-metadata-provider';
import { TokenRegistryProvider } from '@providers/asset-metadata/token-registry-provider';
import { CancelSwapRequest } from '@requests/cancel-swap-request';
import { FetchRequest } from '@requests/fetch-request';
import axios from "axios";
import axiosRetry from "axios-retry";

export class Dexter {

    public config: DexterConfig;
    public requestConfig: RequestConfig;

    public dataProvider?: BaseDataProvider;
    public walletProvider?: BaseWalletProvider;
    public metadataProvider: BaseMetadataProvider;

    public availableDexs: AvailableDexs;

    constructor(config: DexterConfig = {}, requestConfig: RequestConfig = {}) {
        this.config = Object.assign(
            {},
            {
                shouldFetchMetadata: true,
                shouldFallbackToApi: true,
                shouldSubmitOrders: false,
                metadataMsgBranding: 'Dexter',
            } as DexterConfig,
            config,
        );
        this.requestConfig = Object.assign(
            {},
            {
                timeout: 5000,
                proxyUrl: '',
                retries: 3,
            } as RequestConfig,
            requestConfig,
        );

        // Axios configurations
        axiosRetry(axios, { retries: this.requestConfig.retries });
        axios.defaults.timeout = this.requestConfig.timeout;

        this.metadataProvider = new TokenRegistryProvider(this.requestConfig);
        this.availableDexs = {
            [Minswap.name]: new Minswap(this.requestConfig),
            [SundaeSwap.name]: new SundaeSwap(this.requestConfig),
            [MuesliSwap.name]: new MuesliSwap(this.requestConfig),
            [WingRiders.name]: new WingRiders(this.requestConfig),
            [VyFinance.name]: new VyFinance(this.requestConfig),
        };
    }

    /**
     * Retrieve DEX instance from unique name.
     */
    public dexByName(name: string): BaseDex | undefined {
        return this.availableDexs[name];
    }

    /**
     * Switch to a new data provider.
     */
    public withDataProvider(dataProvider: BaseDataProvider): Dexter {
        this.dataProvider = dataProvider;

        return this;
    }

    /**
     * Switch to a new wallet provider.
     */
    public withWalletProvider(walletProvider: BaseWalletProvider): Dexter {
        this.walletProvider = walletProvider;

        return this;
    }

    /**
     * Switch to a new asset metadata provider.
     */
    public withMetadataProvider(metadataProvider: BaseMetadataProvider): Dexter {
        this.metadataProvider = metadataProvider;

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
            throw new Error('Wallet provider must be set before requesting a swap order.');
        }
        if (! this.walletProvider.isWalletLoaded) {
            throw new Error('Wallet must be loaded before requesting a swap order.');
        }

        return new SwapRequest(this);
    }

    /**
     * New request for cancelling a swap order.
     */
    public newCancelSwapRequest(): CancelSwapRequest {
        if (! this.walletProvider) {
            throw new Error('Wallet provider must be set before requesting a cancel order.');
        }
        if (! this.walletProvider.isWalletLoaded) {
            throw new Error('Wallet must be loaded before requesting a cancel order.');
        }

        return new CancelSwapRequest(this);
    }

}
