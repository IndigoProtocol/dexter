import { PayToAddress } from '../../types';
import { DexTransaction } from '../../dex/models/dex-transaction';

export abstract class WalletProvider {

    abstract publicKeyHash(): string;

    abstract stakingKeyHash(): string;

    abstract createTransaction(): DexTransaction;

    abstract paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;

    abstract signTransaction(transaction: DexTransaction): Promise<DexTransaction>;

    abstract submitTransaction(transaction: DexTransaction): Promise<string>;

}