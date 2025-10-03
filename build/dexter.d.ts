import { AvailableDexs, DexterConfig, RequestConfig } from './types.js';
import { SwapRequest } from './requests/swap-request.js';
import { BaseWalletProvider } from './providers/wallet/base-wallet-provider.js';
import { BaseDex } from './dex/base-dex.js';
import { CancelSwapRequest } from './requests/cancel-swap-request.js';
import { SplitSwapRequest } from './requests/split-swap-request.js';
import { SplitCancelSwapRequest } from './requests/split-cancel-swap-request.js';
import { BaseDataProvider } from './providers/data/base-data-provider.js';
export declare class Dexter {
    config: DexterConfig;
    requestConfig: RequestConfig;
    walletProvider?: BaseWalletProvider;
    dataProvider?: BaseDataProvider;
    availableDexs: AvailableDexs;
    constructor(config?: DexterConfig, requestConfig?: RequestConfig);
    /**
     * Retrieve DEX instance from unique name.
     */
    dexByName(name: string): BaseDex | undefined;
    /**
     * Switch to a new data provider.
     */
    withDataProvider(dataProvider: BaseDataProvider): Dexter;
    /**
     * Switch to a new wallet provider.
     */
    withWalletProvider(walletProvider: BaseWalletProvider): Dexter;
    /**
     * New request for a swap order.
     */
    newSwapRequest(): SwapRequest;
    /**
     * New request for a split swap order.
     */
    newSplitSwapRequest(): SplitSwapRequest;
    /**
     * New request for cancelling a swap order.
     */
    newCancelSwapRequest(): CancelSwapRequest;
    /**
     * New request for a split cancel swap order.
     */
    newSplitCancelSwapRequest(): SplitCancelSwapRequest;
}
