import { BaseDataProvider } from './base-data-provider.js';
import { AssetAddress, DefinitionField, Transaction, UTxO } from '../../types.js';
import { Asset } from '@indigo-labs/iris-sdk';
export declare class MockDataProvider extends BaseDataProvider {
    utxos(address: string, asset?: Asset): Promise<UTxO[]>;
    assetTransactions(asset: Asset): Promise<Transaction[]>;
    transactionUtxos(txHash: string): Promise<UTxO[]>;
    assetAddresses(asset: Asset): Promise<AssetAddress[]>;
    datumValue(datumHash: string): Promise<DefinitionField>;
}
