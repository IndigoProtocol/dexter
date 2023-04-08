import { BaseProvider } from './base-provider';
import axios, { RawAxiosRequestConfig, AxiosInstance } from 'axios';
import { UTxO } from '../types/provider';
import { AssetBalance } from '../types/dex';
import { Asset } from '../dex/models/asset';

export class Blockfrost extends BaseProvider {

    private api: AxiosInstance;

    constructor(url: string, projectId: string) {
        super();

        this.api = axios.create({
            baseURL: url,
            headers: {
                'project_id': projectId,
            },
        } as RawAxiosRequestConfig);
    }

    async utxos(address: string, asset: string = ''): Promise<UTxO[]> {
        try {
            return this.fromPaginatedRequest(`/addresses/${address}/utxos/${asset}`)
                .then((results: any) => {
                    return results.map((utxo: any) => {
                        return {
                            txHash: utxo.tx_hash,
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

    private fromPaginatedRequest(url: string, page: number = 1, results: Array<any> = []): Promise<Array<any>> {
        return this.api.get(url, {
            params: {
                page,
            }
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