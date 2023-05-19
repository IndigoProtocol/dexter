import axios, { AxiosInstance } from 'axios';

export class TokenRegistry {

    private api: AxiosInstance;

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/
     */
    constructor() {
        this.api = axios.create({
            baseURL: 'https://tokens.cardano.org/',
        });
    }

    /**
     * https://input-output-hk.github.io/offchain-metadata-tools/api/latest/#tag/query/paths/~1metadata~1query/post
     */
    metadataBatch(assetIds: string[]): Promise<any> {
        return this.api.post('/metadata/query', {
            subjects: assetIds,
        }).then((response) => response.data.subjects);
    }

}