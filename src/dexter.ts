import { BaseDataProvider } from './providers/data/base-data-provider';
import { FetchRequest } from './requests/fetch-request';
import { AvailableDexs, DexterConfig, RequestConfig } from './types';
import { Minswap } from './dex/minswap';
import { SundaeSwap } from './dex/sundaeswap';
import { MuesliSwap } from './dex/muesliswap';
import { WingRiders } from './dex/wingriders';
import { SwapRequest } from './requests/swap-request';
import { BaseWalletProvider } from './providers/wallet/base-wallet-provider';
import { BaseDex } from './dex/base-dex';
import { CancelRequest } from './requests/cancel-request';
import { VyFinance } from './dex/vyfinance';
import { BaseMetadataProvider } from './providers/asset-metadata/base-metadata-provider';
import { TokenRegistryProvider } from './providers/asset-metadata/token-registry-provider';

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
                shouldSubmitOrders: true,
            } as DexterConfig,
            config,
        );
        this.requestConfig = Object.assign(
            {},
            {
                timeout: 5000,
                shouldUseRequestProxy: true,
            } as RequestConfig,
            requestConfig,
        );

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