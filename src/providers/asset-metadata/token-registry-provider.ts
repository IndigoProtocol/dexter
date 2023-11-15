import axios, { AxiosInstance } from 'axios';
import { AssetMetadata, RequestConfig } from '@app/types';
import { Asset } from '@dex/models/asset';
import { BaseMetadataProvider } from './base-metadata-provider';
import { appendSlash } from '@app/utils';

export class TokenRegistryProvider extends BaseMetadataProvider {

    private _api: AxiosInstance;
    private _requestConfig: RequestConfig;

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/
     */
    constructor(requestConfig: RequestConfig = {}) {
        super();

        this._requestConfig = requestConfig;

        this._api = axios.create({
            timeout: requestConfig.timeout ?? 5000,
            baseURL: `${appendSlash(requestConfig.proxyUrl)}https://tokens.cardano.org/`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/#tag/query/paths/~1metadata~1query/post
     */
    fetch(assets: Asset[]): Promise<AssetMetadata[]> {
        return this._api.post('/metadata/query', {
            subjects: assets.map((asset: Asset) => asset.identifier()),
        }).then((response) => response.data.subjects.map((entry: any) => {
            return {
                policyId: entry.subject.slice(0, 56),
                nameHex: entry.subject.slice(56),
                decimals: entry.decimals ? Number(entry.decimals.value) : 0,
            } as AssetMetadata;
        }));
    }

}
