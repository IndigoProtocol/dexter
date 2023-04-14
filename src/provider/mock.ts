import { BaseProvider } from './base-provider';
import { Transaction, UTxO } from '../types/provider';

export class Mock extends BaseProvider {

    async utxos(address: string, asset?: string): Promise<UTxO[]> {
        return Promise.resolve([]);
    }

    async assetTransactions(assetId: string): Promise<Transaction[]> {
        return Promise.resolve([]);
    }

    async transactionUtxos(txHash: string): Promise<UTxO[]> {
        return Promise.resolve([]);
    }

}