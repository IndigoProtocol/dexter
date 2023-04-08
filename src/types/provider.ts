import { Token } from '../dex/models/asset';

export type AssetBalance = {
    asset: Token,
    quantity: bigint,
}

export type UTxO = {
    txHash: string,
    outputIndex: number,
    assetBalances: AssetBalance[],
};