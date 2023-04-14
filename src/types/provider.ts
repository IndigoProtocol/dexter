import { Token } from '../dex/models/asset';

export type AssetBalance = {
    asset: Token,
    quantity: bigint,
}

export type UTxO = {
    txHash: string,
    address: string,
    datumHash: string,
    outputIndex: number,
    assetBalances: AssetBalance[],
};

export type Transaction = {
    txHash: string,
    txIndex: number,
};