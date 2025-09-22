import { DexTransaction } from '../../dex/models/dex-transaction';
import { BaseWalletProvider } from './base-wallet-provider';
export class MockWalletProvider extends BaseWalletProvider {
    constructor() {
        super();
        this.isWalletLoaded = false;
        this._usableAddress = 'addr1test';
        this._paymentCredential = 'ed56';
        this._stakingCredential = 'bac6';
    }
    address() {
        return this._usableAddress;
    }
    publicKeyHash() {
        return this._paymentCredential;
    }
    stakingKeyHash() {
        return this._stakingCredential;
    }
    loadWallet(walletApi) {
        this.isWalletLoaded = true;
        return Promise.resolve(this);
    }
    loadWalletFromSeedPhrase(seed, options = {}) {
        this.isWalletLoaded = true;
        return Promise.resolve(this);
    }
    createTransaction() {
        return new DexTransaction(this);
    }
    attachMetadata(transaction, key, json) {
        return transaction;
    }
    paymentsForTransaction(transaction, payToAddresses) {
        return Promise.resolve(transaction);
    }
    signTransaction(transaction) {
        return Promise.resolve(transaction);
    }
    submitTransaction(transaction) {
        return Promise.resolve('hashtest');
    }
}
