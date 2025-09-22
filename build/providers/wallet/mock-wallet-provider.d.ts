import { Cip30Api, PayToAddress, WalletOptions } from '../../types';
import { DexTransaction } from '../../dex/models/dex-transaction';
import { BaseWalletProvider } from './base-wallet-provider';
export declare class MockWalletProvider extends BaseWalletProvider {
    isWalletLoaded: boolean;
    private _usableAddress;
    private _paymentCredential;
    private _stakingCredential;
    constructor();
    address(): string;
    publicKeyHash(): string;
    stakingKeyHash(): string;
    loadWallet(walletApi: Cip30Api): Promise<BaseWalletProvider>;
    loadWalletFromSeedPhrase(seed: string[], options?: WalletOptions): Promise<BaseWalletProvider>;
    createTransaction(): DexTransaction;
    attachMetadata(transaction: DexTransaction, key: number, json: Object): DexTransaction;
    paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;
    signTransaction(transaction: DexTransaction): Promise<DexTransaction>;
    submitTransaction(transaction: DexTransaction): Promise<string>;
}
