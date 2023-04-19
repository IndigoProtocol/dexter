import { DatumParameterKey } from './constants';
import { Token } from './dex/models/asset';
import { BaseDex } from './dex/base-dex';
import { LiquidityPool } from './dex/models/liquidity-pool';

export interface DexterConfig {
    shouldFetchMetadata?: false,
}

export type DexterResponse = {
    [dex: string]: LiquidityPool[],
}
export type AvailableDexs = {
    [dex: string]: BaseDex,
}

export type DatumParameters = {
    [key in DatumParameterKey | string]?: string | number
}

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

export type DefinitionBytes = {
    bytes: string | DatumParameterKey,
}

export type DefinitionInt = {
    int: number | DatumParameterKey,
}

export type DefinitionField = DefinitionConstr | DefinitionBytes | DefinitionInt

export type DefinitionConstr = {
    constructor: number | DatumParameterKey,
    fields: DefinitionField[],
}