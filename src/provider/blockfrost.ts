import { BaseProvider } from './base-provider';
import axios, { RawAxiosRequestConfig, AxiosInstance } from 'axios';
import { Asset } from '../dex/models/asset';
import { AssetAddress, AssetBalance, DefinitionField, Transaction, UTxO } from '../types';

export class Blockfrost extends BaseProvider {

    private api: AxiosInstance;

    /**
     * https://docs.blockfrost.io/
     */
    constructor(url: string, projectId: string) {
        super();

        this.api = axios.create({
            baseURL: url,
            headers: {
                'project_id': projectId,
            },
        } as RawAxiosRequestConfig);
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos/get
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos~1%7Basset%7D/get
     */
    async utxos(address: string, asset?: Asset): Promise<UTxO[]> {
        try {
            return this.fromPaginatedRequest(`/addresses/${address}/utxos/${asset ? asset.id() : ''}`)
                .then((results: any) => {
                    return results.map((utxo: any) => {
                        return {
                            txHash: utxo.tx_hash,
                            address: utxo.address,
                            datumHash: utxo.data_hash,
                            outputIndex: utxo.output_index,
                            assetBalances: utxo.amount.reduce((assets: AssetBalance[], amount: any) => {
                                assets.push({
                                    asset: amount.unit === 'lovelace' ? amount.unit : Asset.fromId(amount.unit),
                                    quantity: BigInt(amount.quantity),
                                })
                                return assets;
                            }, []),
                        } as UTxO;
                    }) as UTxO[];
                });
        } catch (e) {
            return [];
        }
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Transactions/paths/~1txs~1%7Bhash%7D~1utxos/get
     */
    async transactionUtxos(txHash: string): Promise<UTxO[]> {
        return this.api.get(`/txs/${txHash}/utxos`)
            .then((response: any) => {
                return response.data.outputs.map((utxo: any) => {
                    return {
                        txHash: response.data.hash,
                        address: utxo.address,
                        datumHash: utxo.data_hash,
                        outputIndex: utxo.output_index,
                        assetBalances: utxo.amount.reduce((assets: AssetBalance[], amount: any) => {
                            assets.push({
                                asset: amount.unit === 'lovelace' ? amount.unit : Asset.fromId(amount.unit),
                                quantity: BigInt(amount.quantity),
                            })
                            return assets;
                        }, []),
                    } as UTxO;
                }) as UTxO[];
            });
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    async assetTransactions(asset: Asset): Promise<Transaction[]> {
        try {
            return this.fromPaginatedRequest(`/assets/${asset.id()}/transactions`)
                .then((results: any) => {
                    return results.map((tx: any) => {
                        return {
                            txHash: tx.tx_hash,
                            txIndex: tx.tx_index,
                        } as Transaction;
                    }) as Transaction[];
                });
        } catch (e) {
            return [];
        }
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    async assetAddresses(asset: Asset): Promise<AssetAddress[]> {
        try {
            return this.fromPaginatedRequest(`/assets/${asset.id()}/addresses`)
                .then((results: any) => {
                    return results.map((result: any) => {
                        return {
                            address: result.address,
                            quantity: BigInt(result.quantity),
                        } as AssetAddress;
                    }) as AssetAddress[];
                });
        } catch (e) {
            return [];
        }
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Scripts/paths/~1scripts~1datum~1%7Bdatum_hash%7D/get
     */
    async datumValue(datumHash: string): Promise<DefinitionField> {
        return this.api.get(`/scripts/datum/${datumHash}`)
            .then((response: any) => {
                return response.data.json_value as DefinitionField;
            });
    }

    /**
     * https://docs.blockfrost.io/#section/Concepts
     */
    private fromPaginatedRequest(url: string, page: number = 1, results: any = []): Promise<any> {
        return this.api.get(url, {
            params: {
                page,
            },
        }).then((response: any) => {
            if (response.data.length === 0) {
                return results;
            }

            results = results.concat(response.data);
            page++;

            return this.fromPaginatedRequest(url, page, results);
        });
    }

}