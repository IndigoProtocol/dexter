import { BaseDataProvider } from './base-data-provider';
import axios from 'axios';
import { Data } from 'lucid-cardano';
import { appendSlash } from '../../utils';
import { Asset } from '@indigo-labs/iris-sdk';
export class KupoProvider extends BaseDataProvider {
    constructor(config, requestConfig = {}) {
        super();
        this._requestConfig = Object.assign({}, {
            timeout: 5000,
            proxyUrl: '',
        }, requestConfig);
        this._config = config;
        this._kupoApi = axios.create({
            baseURL: appendSlash(requestConfig.proxyUrl) + config.url,
            timeout: this._requestConfig.timeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    async utxos(address, asset) {
        const url = asset
            ? `/matches/${address}?policy_id=${asset.policyId}&asset_name=${asset.nameHex}&unspent`
            : `/matches/${address}?unspent`;
        return this._kupoApi.get(url)
            .then((results) => {
            return this.toUtxos(results.data);
        });
    }
    async transactionUtxos(txHash) {
        return this._kupoApi.get(`/matches/*@${txHash}`)
            .then((results) => {
            return this.toUtxos(results.data);
        });
    }
    async datumValue(datumHash) {
        return this._kupoApi.get(`/datums/${datumHash}`)
            .then((result) => {
            if (!result.data.datum) {
                throw new Error('Datum hash not found.');
            }
            return this.toDefinitionDatum(Data.from(result.data.datum));
        });
    }
    async assetTransactions(asset) {
        return this._kupoApi.get(`/matches/${asset.identifier('.')}`)
            .then((results) => {
            return results.data.map((result) => {
                return {
                    hash: result.transaction_id,
                };
            });
        });
    }
    async assetAddresses(asset) {
        return this._kupoApi.get(`/matches/${asset.identifier('.')}?unspent`)
            .then((results) => {
            return results.data.map((result) => {
                return {
                    address: result.address,
                    quantity: BigInt(result.value.assets[asset.identifier('.')]),
                };
            });
        });
    }
    toUtxos(results) {
        return results.map((utxo) => {
            return {
                txHash: utxo.transaction_id,
                address: utxo.address,
                datumHash: utxo.datum_hash,
                outputIndex: utxo.output_index,
                assetBalances: (() => {
                    const balances = [
                        {
                            asset: 'lovelace',
                            quantity: BigInt(utxo.value.coins),
                        }
                    ];
                    Object.keys(utxo.value.assets).forEach((unit) => {
                        balances.push({
                            asset: Asset.fromIdentifier(unit),
                            quantity: BigInt(utxo.value.assets[unit]),
                        });
                    });
                    return balances;
                })(),
            };
        });
    }
    toDefinitionDatum(unconstructedField) {
        if (unconstructedField?.fields) {
            return {
                constructor: unconstructedField.index,
                fields: unconstructedField.fields.map((field) => this.toDefinitionDatum(field)),
            };
        }
        if (typeof unconstructedField === 'bigint') {
            return {
                int: Number(unconstructedField)
            };
        }
        if (typeof unconstructedField === 'string') {
            return {
                bytes: unconstructedField
            };
        }
        return unconstructedField;
    }
}
