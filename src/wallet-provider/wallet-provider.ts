import { PayToAddress } from '../types';
import { DexTransaction } from '../dex/models/dex-transaction';

export abstract class WalletProvider {

    public abstract publicKeyHash(): string;

    public abstract stakingKeyHash(): string;

    public abstract createTransaction(): DexTransaction;

    public abstract paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;

    public abstract signTransaction(transaction: DexTransaction): Promise<DexTransaction>;

    public abstract submitTransaction(transaction: DexTransaction): Promise<string>;

}