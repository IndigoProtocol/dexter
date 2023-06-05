import { Cip30Api, PayToAddress, WalletOptions } from '@app/types';
import { DexTransaction } from '@dex/models/dex-transaction';

export abstract class BaseWalletProvider {

    public abstract isWalletLoaded: boolean;

    abstract address(): string;

    abstract publicKeyHash(): string;

    abstract stakingKeyHash(): string;

    abstract loadWallet(walletApi: Cip30Api, config: any): Promise<BaseWalletProvider>;

    abstract loadWalletFromSeedPhrase(seed: string[], options: WalletOptions, config: any): Promise<BaseWalletProvider>;

    abstract createTransaction(): DexTransaction;

    abstract paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;

    abstract signTransaction(transaction: DexTransaction): Promise<DexTransaction>;

    abstract submitTransaction(transaction: DexTransaction): Promise<string>;

}