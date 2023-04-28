import { PayToAddress } from '../types';
import { DexTransaction } from '../dex/models/dex-transaction';

export abstract class WalletProvider {

    abstract publicKeyHash(): string;

    abstract stakingKeyHash(): string;

    abstract createTransaction(): Promise<DexTransaction>;

    abstract payToAddresses(payToAddresses: PayToAddress[]): WalletProvider;

    abstract submitTransaction(): WalletProvider;

}