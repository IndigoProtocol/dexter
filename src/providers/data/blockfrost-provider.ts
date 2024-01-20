import { BaseDataProvider } from './base-data-provider';
import axios, { AxiosInstance } from 'axios';
import {
    AssetAddress,
    AssetBalance,
    BlockfrostConfig,
    DefinitionField,
    RequestConfig,
    Transaction,
    UTxO
} from '@app/types';
import { Asset } from '@dex/models/asset';
import Bottleneck from 'bottleneck';
import { appendSlash } from '@app/utils';

const API_BURST_SIZE: number = 500;
const API_COOLDOWN_SIZE: number = 10;
const API_COOLDOWN_MS: number = 1000;

export class BlockfrostProvider extends BaseDataProvider {

    private _api: AxiosInstance;
    private _requestConfig: RequestConfig;
    private _limiter: Bottleneck;

    /**
     * https://docs.blockfrost.io/
     */
    constructor(config: BlockfrostConfig, requestConfig: RequestConfig = {}) {
        super();

        this._requestConfig = Object.assign(
            {},
            {
                timeout: 5000,
                proxyUrl: '',
            } as RequestConfig,
            requestConfig,
        );

        this._api = axios.create({
            baseURL: (appendSlash(requestConfig.proxyUrl)) + config.url,
            timeout: this._requestConfig.timeout,
            headers: {
                'Content-Type': 'application/json',
                project_id: config.projectId,
            },
        });

        // https://docs.blockfrost.io/#section/Limits
        this._limiter = new Bottleneck({
            reservoir: API_BURST_SIZE,
            reservoirIncreaseAmount: API_COOLDOWN_SIZE,
            reservoirIncreaseInterval: API_COOLDOWN_MS,
            reservoirIncreaseMaximum: API_BURST_SIZE,
        });
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos/get
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos~1%7Basset%7D/get
     */
    public async utxos(address: string, asset?: Asset): Promise<UTxO[]> {
        return this.sendPaginatedRequest(`/addresses/${address}/utxos/${asset ? asset.identifier() : ''}`)
            .then((results: any) => {
                return results.map((utxo: any) => {
                    return {
                        txHash: utxo.tx_hash,
                        address: utxo.address,
                        datumHash: utxo.data_hash,
                        outputIndex: utxo.output_index,
                        assetBalances: utxo.amount.reduce((assets: AssetBalance[], amount: any) => {
                            assets.push({
                                asset: amount.unit === 'lovelace' ? amount.unit : Asset.fromIdentifier(amount.unit),
                                quantity: BigInt(amount.quantity),
                            })
                            return assets;
                        }, []),
                    } as UTxO;
                }) as UTxO[];
            });
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Transactions/paths/~1txs~1%7Bhash%7D~1utxos/get
     */
    public async transactionUtxos(txHash: string): Promise<UTxO[]> {
        return this._limiter.schedule(() => this._api.get(`/txs/${txHash}/utxos`))
            .then((response: any) => {
                return response.data.outputs.map((utxo: any) => {
                    return {
                        txHash: response.data.hash,
                        address: utxo.address,
                        datumHash: utxo.data_hash,
                        datum: utxo.inline_datum,
                        outputIndex: utxo.output_index,
                        assetBalances: utxo.amount.reduce((assets: AssetBalance[], amount: any) => {
                            assets.push({
                                asset: amount.unit === 'lovelace' ? amount.unit : Asset.fromIdentifier(amount.unit),
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
    public async assetTransactions(asset: Asset): Promise<Transaction[]> {
        return this.sendPaginatedRequest(`/assets/${asset.identifier()}/transactions`)
            .then((results: any) => {
                return results.map((tx: any) => {
                    return {
                        hash: tx.tx_hash,
                    } as Transaction;
                }) as Transaction[];
            });
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    public async assetAddresses(asset: Asset): Promise<AssetAddress[]> {
        return this.sendPaginatedRequest(`/assets/${asset.identifier()}/addresses`)
            .then((results: any) => {
                return results.map((result: any) => {
                    return {
                        address: result.address,
                        quantity: BigInt(result.quantity),
                    } as AssetAddress;
                }) as AssetAddress[];
            });
    }

    /**
     * https://docs.blockfrost.io/#tag/Cardano-Scripts/paths/~1scripts~1datum~1%7Bdatum_hash%7D/get
     */
    public async datumValue(datumHash: string): Promise<DefinitionField> {
        return this._limiter.schedule(() => this._api.get(`/scripts/datum/${datumHash}`))
            .then((response: any) => {
                return response.data.json_value as DefinitionField;
            });
    }

    /**
     * https://docs.blockfrost.io/#section/Concepts
     */
    private sendPaginatedRequest(url: string, page: number = 1, results: any = []): Promise<any> {
        return this._limiter.schedule(() =>
            this._api.get(url, {
                params: {
                    page,
                },
            })
        ).then((response: any) => {
            results = results.concat(response.data);
            page++;

            // Possibly more data to grab
            if (response.data.length === 100) {
                return this.sendPaginatedRequest(url, page, results);
            }

            return results;
        });
    }

}
