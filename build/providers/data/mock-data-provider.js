import { BaseDataProvider } from './base-data-provider';
export class MockDataProvider extends BaseDataProvider {
    async utxos(address, asset) {
        return Promise.resolve([]);
    }
    async assetTransactions(asset) {
        return Promise.resolve([]);
    }
    async transactionUtxos(txHash) {
        return Promise.resolve([]);
    }
    async assetAddresses(asset) {
        return Promise.resolve([]);
    }
    datumValue(datumHash) {
        return Promise.resolve({
            constructor: 0,
            fields: [],
        });
    }
}
