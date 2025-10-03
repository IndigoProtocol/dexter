import { BaseDataProvider } from './base-data-provider.js';
import axios from 'axios';
import Bottleneck from 'bottleneck';
import { appendSlash } from '../../utils.js';
import { Asset } from '@indigo-labs/iris-sdk';
const API_BURST_SIZE = 500;
const API_COOLDOWN_SIZE = 10;
const API_COOLDOWN_MS = 1000;
export class BlockfrostProvider extends BaseDataProvider {
    /**
     * https://docs.blockfrost.io/
     */
    constructor(config, requestConfig = {}) {
        super();
        this._requestConfig = Object.assign({}, {
            timeout: 5000,
            proxyUrl: '',
        }, requestConfig);
        this._api = axios.default.create({
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
    async utxos(address, asset) {
        return this.sendPaginatedRequest(`/addresses/${address}/utxos/${asset ? asset.identifier() : ''}`)
            .then((results) => {
            return results.map((utxo) => {
                return {
                    txHash: utxo.tx_hash,
                    address: utxo.address,
                    datumHash: utxo.data_hash,
                    outputIndex: utxo.output_index,
                    assetBalances: utxo.amount.reduce((assets, amount) => {
                        assets.push({
                            asset: amount.unit === 'lovelace' ? amount.unit : Asset.fromIdentifier(amount.unit),
                            quantity: BigInt(amount.quantity),
                        });
                        return assets;
                    }, []),
                };
            });
        });
    }
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Transactions/paths/~1txs~1%7Bhash%7D~1utxos/get
     */
    async transactionUtxos(txHash) {
        return this._limiter.schedule(() => this._api.get(`/txs/${txHash}/utxos`))
            .then((response) => {
            return response.data.outputs.map((utxo) => {
                return {
                    txHash: response.data.hash,
                    address: utxo.address,
                    datumHash: utxo.data_hash,
                    datum: utxo.inline_datum,
                    outputIndex: utxo.output_index,
                    assetBalances: utxo.amount.reduce((assets, amount) => {
                        assets.push({
                            asset: amount.unit === 'lovelace' ? amount.unit : Asset.fromIdentifier(amount.unit),
                            quantity: BigInt(amount.quantity),
                        });
                        return assets;
                    }, []),
                };
            });
        });
    }
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    async assetTransactions(asset) {
        return this.sendPaginatedRequest(`/assets/${asset.identifier()}/transactions`)
            .then((results) => {
            return results.map((tx) => {
                return {
                    hash: tx.tx_hash,
                };
            });
        });
    }
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    async assetAddresses(asset) {
        return this.sendPaginatedRequest(`/assets/${asset.identifier()}/addresses`)
            .then((results) => {
            return results.map((result) => {
                return {
                    address: result.address,
                    quantity: BigInt(result.quantity),
                };
            });
        });
    }
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Scripts/paths/~1scripts~1datum~1%7Bdatum_hash%7D/get
     */
    async datumValue(datumHash) {
        return this._limiter.schedule(() => this._api.get(`/scripts/datum/${datumHash}`))
            .then((response) => {
            return response.data.json_value;
        });
    }
    /**
     * https://docs.blockfrost.io/#section/Concepts
     */
    sendPaginatedRequest(url, page = 1, results = []) {
        return this._limiter.schedule(() => this._api.get(url, {
            params: {
                page,
            },
        })).then((response) => {
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
