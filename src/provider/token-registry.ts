import axios, { RawAxiosRequestConfig, AxiosInstance } from 'axios';

export class TokenRegistry {

    private api: AxiosInstance;

    constructor(url: string) {
        this.api = axios.create({
            baseURL: url,
        } as RawAxiosRequestConfig);
    }

}