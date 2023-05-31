import { Cip30Api, PayToAddress, WalletOptions } from '@/types';
import { DexTransaction } from '@dex/models/dex-transaction';
import { BaseWalletProvider } from './base-wallet-provider';

export class MockWalletProvider extends BaseWalletProvider {

    public isWalletLoaded: boolean = false;

    private _usableAddress: string;
    private _paymentCredential: string;
    private _stakingCredential: string;

    constructor() {
        super();

        this._usableAddress = 'addr1test';
        this._paymentCredential = 'ed56';
        this._stakingCredential = 'bac6';
    }

    public address(): string {
        return this._usableAddress;
    }

    public publicKeyHash(): string {
        return this._paymentCredential;
    }

    public stakingKeyHash(): string {
        return this._stakingCredential;
    }

    public loadWallet(walletApi: Cip30Api): Promise<BaseWalletProvider> {
        this.isWalletLoaded = true;

        return Promise.resolve(this as BaseWalletProvider);
    }

    public loadWalletFromSeedPhrase(seed: string[], options: WalletOptions): Promise<BaseWalletProvider> {
        this.isWalletLoaded = true;

        return Promise.resolve(this as BaseWalletProvider);
    }

    public createTransaction(): DexTransaction {
        return new DexTransaction(this);
    }

    public paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction> {
        return Promise.resolve(transaction);
    }

    public signTransaction(transaction: DexTransaction): Promise<DexTransaction> {
        return Promise.resolve(transaction);
    }

    public submitTransaction(transaction: DexTransaction): Promise<string> {
        return Promise.resolve('hashtest');
    }

}