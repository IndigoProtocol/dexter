import { BaseDataProvider } from './base-data-provider';
import { AssetAddress, DefinitionField, KupoConfig, RequestConfig, Transaction, UTxO } from '../../types';
import { Asset } from '@indigo-labs/iris-sdk';
export declare class KupoProvider extends BaseDataProvider {
    private _config;
    private _kupoApi;
    private _requestConfig;
    constructor(config: KupoConfig, requestConfig?: RequestConfig);
    utxos(address: string, asset?: Asset): Promise<UTxO[]>;
    transactionUtxos(txHash: string): Promise<UTxO[]>;
    datumValue(datumHash: string): Promise<DefinitionField>;
    assetTransactions(asset: Asset): Promise<Transaction[]>;
    assetAddresses(asset: Asset): Promise<AssetAddress[]>;
    private toUtxos;
    private toDefinitionDatum;
}
