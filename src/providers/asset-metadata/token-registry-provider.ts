import axios, { AxiosInstance } from 'axios';
import { AssetMetadata, RequestConfig } from '../../types';
import { Asset } from '../../dex/models/asset';
import { BaseMetadataProvider } from './base-metadata-provider';

export class TokenRegistryProvider extends BaseMetadataProvider {

    private _api: AxiosInstance;
    private _requestConfig: RequestConfig;

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/
     */
    constructor(requestConfig: RequestConfig) {
        super();

        this._requestConfig = requestConfig;

        this._api = axios.create({
            timeout: requestConfig.timeout,
            baseURL: this._requestConfig.shouldUseRequestProxy
                ? 'https://cors-anywhere.herokuapp.com/https://tokens.cardano.org/'
                : 'https://tokens.cardano.org/',
        });
    }

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/#tag/query/paths/~1metadata~1query/post
     */
    fetch(assets: Asset[]): Promise<AssetMetadata[]> {
        return this._api.post('/metadata/query', {
            subjects: assets.map((asset: Asset) => asset.id()),
        }).then((response) => {
            return response.data.subjects.map((subject: any) => {
               return {
                   decimals: Number(subject.decimals.value),
               } as AssetMetadata;
            });
        });
    }

}