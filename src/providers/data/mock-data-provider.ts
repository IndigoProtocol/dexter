import { BaseDataProvider } from './base-data-provider';
import { AssetAddress, DefinitionField, Transaction, UTxO } from '@app/types';
import { Asset } from '@dex/models/asset';

export class MockDataProvider extends BaseDataProvider {

    public async utxos(address: string, asset?: Asset): Promise<UTxO[]> {
        return Promise.resolve([]);
    }

    public async assetTransactions(asset: Asset): Promise<Transaction[]> {
        return Promise.resolve([]);
    }

    public async transactionUtxos(txHash: string): Promise<UTxO[]> {
        return Promise.resolve([]);
    }

    public async assetAddresses(asset: Asset): Promise<AssetAddress[]> {
        return Promise.resolve([]);
    }

    public datumValue(datumHash: string): Promise<DefinitionField> {
        return Promise.resolve({
            constructor: 0,
            fields: [],
        });
    }

}