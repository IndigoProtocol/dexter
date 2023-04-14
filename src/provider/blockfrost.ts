import { BaseProvider } from './base-provider';
import axios, { RawAxiosRequestConfig, AxiosInstance } from 'axios';
import { AssetBalance, Transaction, UTxO } from '../types/provider';
import { Asset } from '../dex/models/asset';
import { Data, Datum, fromHex } from 'lucid-cardano';

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
    async utxos(address: string, assetId: string = ''): Promise<UTxO[]> {
        try {
            return this.fromPaginatedRequest(`/addresses/${address}/utxos/${assetId}`)
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
    async assetTransactions(assetId: string): Promise<Transaction[]> {
        try {
            return this.fromPaginatedRequest(`/assets/${assetId}/transactions`)
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

    private fromPaginatedRequest(url: string, page: number = 1, results: Array<any> = []): Promise<Array<any>> {
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