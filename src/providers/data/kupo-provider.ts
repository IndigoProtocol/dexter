import { BaseDataProvider } from './base-data-provider';
import { Asset } from '@dex/models/asset';
import {
    AssetAddress,
    AssetBalance,
    DefinitionBytes,
    DefinitionConstr,
    DefinitionField,
    DefinitionInt,
    KupoConfig,
    RequestConfig,
    Transaction,
    UTxO
} from '@app/types';
import axios, { AxiosInstance } from 'axios';
import { Data } from 'lucid-cardano';
import { appendSlash } from '@app/utils';

export class KupoProvider extends BaseDataProvider {

    private _config: KupoConfig;
    private _kupoApi: AxiosInstance;
    private _requestConfig: RequestConfig;

    constructor(config: KupoConfig, requestConfig: RequestConfig = {}) {
        super();

        this._requestConfig = Object.assign(
            {},
            {
                timeout: 5000,
                proxyUrl: '',
            } as RequestConfig,
            requestConfig,
        );

        this._config = config;
        this._kupoApi = axios.create({
            baseURL: appendSlash(requestConfig.proxyUrl) + config.url,
            timeout: this._requestConfig.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public async utxos(address: string, asset?: Asset): Promise<UTxO[]> {
        const url: string = asset
            ? `/matches/${address}?policy_id=${asset.policyId}&asset_name=${asset.nameHex}&unspent`
            : `/matches/${address}?unspent`;

        return this._kupoApi.get(url)
            .then((results: any) => {
                return this.toUtxos(results.data);
            });
    }

    public async transactionUtxos(txHash: string): Promise<UTxO[]> {
        return this._kupoApi.get(`/matches/*@${txHash}`)
            .then((results: any) => {
                return this.toUtxos(results.data);
            });
    }

    public async datumValue(datumHash: string): Promise<DefinitionField> {
        return this._kupoApi.get(`/datums/${datumHash}`)
            .then((result: any) => {
                if (! result.data.datum) {
                    throw new Error('Datum hash not found.');
                }

                return this.toDefinitionDatum(Data.from(result.data.datum));
            });
    }

    public async assetTransactions(asset: Asset): Promise<Transaction[]> {
        return this._kupoApi.get(`/matches/${asset.identifier('.')}`)
            .then((results: any) => {
                return results.data.map((result: any) => {
                    return {
                        hash: result.transaction_id,
                    } as Transaction
                }) as Transaction[];
            });
    }

    public async assetAddresses(asset: Asset): Promise<AssetAddress[]> {
        return this._kupoApi.get(`/matches/${asset.identifier('.')}?unspent`)
            .then((results: any) => {
                return results.data.map((result: any) => {
                    return {
                        address: result.address,
                        quantity: BigInt(result.value.assets[asset.identifier('.')]),
                    } as AssetAddress
                }) as AssetAddress[];
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
                            asset: Asset.fromIdentifier(unit),
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
