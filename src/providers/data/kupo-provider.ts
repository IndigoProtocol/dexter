import { BaseDataProvider } from './base-data-provider';
import { Asset } from '@dex/models/asset';
import {
    AssetAddress,
    AssetBalance,
    DefinitionBytes,
    DefinitionConstr,
    DefinitionField,
    DefinitionInt,
    KupmiosConfig,
    Transaction,
    UTxO
} from '@app/types';
import axios, { AxiosInstance } from 'axios';
import { Data } from 'lucid-cardano';

export class KupoProvider extends BaseDataProvider {

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
                return this.toDefinitionDatum(Data.from(result.data.datum));
            });
    }

    public async assetTransactions(asset: Asset): Promise<Transaction[]> {
        return this._kupoApi.get(`${this._config.kupoUrl}/matches/${asset.id('.')}`)
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
        return this._kupoApi.get(`${this._config.kupoUrl}/matches/${asset.id('.')}?unspent`)
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

    private toDefinitionDatum(unconstructedField: any): DefinitionField {
        if (unconstructedField?.fields) {
            return {
                constructor: unconstructedField.index,
                fields: unconstructedField.fields.map((field: any) => this.toDefinitionDatum(field)),
            } as DefinitionConstr;
        }

        if (typeof unconstructedField === 'bigint') {
            return {
              int: Number(unconstructedField)
            } as DefinitionInt;
        }

        if (typeof unconstructedField === 'string') {
            return {
                bytes: unconstructedField
            } as DefinitionBytes;
        }

        return unconstructedField;
    }

}