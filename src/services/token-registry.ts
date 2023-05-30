import axios, { AxiosInstance } from 'axios';
import { RequestConfig } from '../types';

export class TokenRegistry {

    private _api: AxiosInstance;
    private _requestConfig: RequestConfig;

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/
     */
    constructor(requestConfig: RequestConfig) {
        this._requestConfig = requestConfig;

        this._api = axios.create({
            baseURL: this._requestConfig.shouldUseRequestProxy
                ? 'https://cors-anywhere.herokuapp.com/https://tokens.cardano.org/'
                : 'https://tokens.cardano.org/',
        });
    }

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/#tag/query/paths/~1metadata~1query/post
     */
    metadataBatch(assetIds: string[]): Promise<any> {
        return this._api.post('/metadata/query', {
            subjects: assetIds,
        }).then((response) => response.data.subjects);
    }

}