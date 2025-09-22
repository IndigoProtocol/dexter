import { BlockfrostConfig, Cip30Api, KupmiosConfig, PayToAddress, WalletOptions } from '../../types';
import { DexTransaction } from '../../dex/models/dex-transaction';
import { BaseWalletProvider } from './base-wallet-provider';
export declare class LucidProvider extends BaseWalletProvider {
    isWalletLoaded: boolean;
    private _api;
    private _usableAddress;
    private _paymentCredential;
    private _stakingCredential;
    address(): string;
    publicKeyHash(): string;
    stakingKeyHash(): string;
    loadWallet(walletApi: Cip30Api, config: BlockfrostConfig | KupmiosConfig): Promise<BaseWalletProvider>;
    loadWalletFromSeedPhrase(seed: string[], options: WalletOptions | undefined, config: BlockfrostConfig | KupmiosConfig): Promise<BaseWalletProvider>;
    createTransaction(): DexTransaction;
    attachMetadata(transaction: DexTransaction, key: number, json: Object): DexTransaction;
    paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;
    signTransaction(transaction: DexTransaction): Promise<DexTransaction>;
    submitTransaction(transaction: DexTransaction): Promise<string>;
    private paymentFromAssets;
    private loadWalletInformation;
    private loadLucid;
}
