import { BaseDataProvider } from './base-data-provider';
import { Asset } from '../../dex/models/asset';
import { AssetAddress, AssetBalance, DefinitionField, KupmiosConfig, Transaction, UTxO } from '../../types';
import axios, { AxiosInstance } from 'axios';
import { Data } from 'lucid-cardano';

export class KupmiosProvider extends BaseDataProvider {

    private _config: KupmiosConfig;
    private _kupoApi: AxiosInstance;

    constructor(config: KupmiosConfig) {
        super();

        this._config = config;
        this._kupoApi = axios.create({
            baseURL: config.kupoUrl,
        });
    }

    public async utxos(address: string, asset?: Asset): Promise<UTxO[]> {
        const url: string = asset
            ? `${this._config.kupoUrl}/matches/${address}?policy_id=${asset.policyId}&asset_name=${asset.assetNameHex}&unspent`
            : `${this._config.kupoUrl}/matches/${address}`;

        return this._kupoApi.get(url)
            .then((results: any) => {
                return this.toUtxos(results.data);
            }).catch(() => {
                return Promise.resolve([]);
            });
    }

    public async transactionUtxos(txHash: string): Promise<UTxO[]> {
        return this._kupoApi.get(`${this._config.kupoUrl}/matches/${txHash}`)
            .then((results: any) => {
                return this.toUtxos(results.data);
            }).catch(() => {
                return Promise.resolve([]);
            });
    }

    public async datumValue(datumHash: string): Promise<DefinitionField> {
        return this._kupoApi.get(`${this._config.kupoUrl}/datums/${datumHash}`)
            .then((result: any) => {
                return Data.from(result.data.datum) as DefinitionField;
            });
    }

    public async assetTransactions(asset: Asset): Promise<Transaction[]> {
        return this._kupoApi.get(`${this._config.kupoUrl}/matches/*?policy_id=${asset.policyId}&asset_name=${asset.assetNameHex}`)
            .then((results: any) => {
                return results.data.map((result: any) => {
                    return {
                        txHash: result.transaction_id,
                        txIndex: result.transaction_index,
                    } as Transaction
                }) as Transaction[];
            }).catch(() => {
                return Promise.resolve([]);
            });
    }

    public async assetAddresses(asset: Asset): Promise<AssetAddress[]> {
        return this._kupoApi.get(`${this._config.kupoUrl}/matches/*?policy_id=${asset.policyId}&asset_name=${asset.assetNameHex}`)
            .then((results: any) => {
                return results.data.map((result: any) => {
                    return {
                        address: result.address,
                        quantity: BigInt(result.value.assets[asset.id('.')]),
                    } as AssetAddress
                }) as AssetAddress[];
            }).catch(() => {
                return Promise.resolve([]);
            });
    }

    private toUtxos(results: any): UTxO[] {
        return results.map((utxo: any) => {
            return {
                txHash: utxo.transaction_id,
                address: utxo.address,
                datumHash: utxo.datum_hash,
                outputIndex: utxo.output_index,
                assetBalances: (() => {
                    const balances: AssetBalance[] = [
                        {
                            asset: 'lovelace',
                            quantity: BigInt(utxo.value.coins),
                        }
                    ];
                    Object.keys(utxo.value.assets).forEach((unit: string) => {
                        balances.push({
                            asset: Asset.fromId(unit.replace('.', '')),
                            quantity: BigInt(utxo.value.assets[unit]),
                        });
                    });
                    return balances;
                })(),
            } as UTxO;
        }) as UTxO[];
    }

}