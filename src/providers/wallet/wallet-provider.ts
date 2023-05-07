import { Cip30Api, PayToAddress, WalletOptions } from '../../types';
import { DexTransaction } from '../../dex/models/dex-transaction';

export abstract class WalletProvider {

    abstract address(): string;

    abstract publicKeyHash(): string;

    abstract stakingKeyHash(): string;

    abstract loadWallet(walletApi: Cip30Api): Promise<WalletProvider>;

    abstract loadWalletFromSeedPhrase(seed: string[], options: WalletOptions): Promise<WalletProvider>;

    abstract createTransaction(): DexTransaction;

    abstract paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;

    abstract signTransaction(transaction: DexTransaction): Promise<DexTransaction>;

    abstract submitTransaction(transaction: DexTransaction): Promise<string>;

}