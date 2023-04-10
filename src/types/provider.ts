import { Token } from '../dex/models/asset';

export type AssetBalance = {
    asset: Token,
    quantity: bigint,
}

export type UTxO = {
    address: string,
    outputIndex: number,
    assetBalances: AssetBalance[],
};

export type Transaction = {
    txHash: string,
    txIndex: number,
};