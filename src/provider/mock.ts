import { BaseProvider } from './base-provider';
import { DefinitionField, Transaction, UTxO } from '../types';

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

    datumValue(datumHash: string): Promise<DefinitionField> {
        return Promise.resolve({
            constructor: 0,
            fields: [],
        });
    }

}