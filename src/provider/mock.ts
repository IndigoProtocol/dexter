import { BaseProvider } from './base-provider';
import { AssetAddress, DefinitionField, Transaction, UTxO } from '../types';
import { Asset } from '../dex/models/asset';

export class Mock extends BaseProvider {

    async utxos(address: string, asset?: Asset): Promise<UTxO[]> {
        return Promise.resolve([]);
    }

    async assetTransactions(asset: Asset): Promise<Transaction[]> {
        return Promise.resolve([]);
    }

    async transactionUtxos(txHash: string): Promise<UTxO[]> {
        return Promise.resolve([]);
    }

    async assetAddresses(asset: Asset): Promise<AssetAddress[]> {
        return Promise.resolve([]);
    }

    datumValue(datumHash: string): Promise<DefinitionField> {
        return Promise.resolve({
            constructor: 0,
            fields: [],
        });
    }

}