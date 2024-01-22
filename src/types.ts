import { AddressType, DatumParameterKey, TransactionStatus } from './constants';
import { Token } from '@dex/models/asset';
import { BaseDex } from '@dex/base-dex';
import { LiquidityPool } from '@dex/models/liquidity-pool';
import { Script } from 'lucid-cardano';

export interface DexterConfig {
    shouldFetchMetadata?: boolean,
    shouldFallbackToApi?: boolean,
    shouldSubmitOrders?: boolean,
    metadataMsgBranding?: string,
}

export interface RequestConfig {
    timeout?: number,
    proxyUrl?: string,
    retries?: number,
}

export interface BlockfrostConfig {
    url: string,
    projectId: string,
}

export interface KupoConfig {
    url: string,
}

export interface KupmiosConfig {
    kupoUrl: string,
    ogmiosUrl: string,
}

export type AvailableDexs = {
    [dex: string]: BaseDex,
}

export type DatumParameters = {
    [key in DatumParameterKey | string]?: string | number | bigint
}

export type AssetBalance = {
    asset: Token,
    quantity: bigint,
}

export type UTxO = {
    txHash: string,
    address: string,
    datumHash: string,
    datum?: string,
    outputIndex: number,
    assetBalances: AssetBalance[],
};

export type Transaction = {
    hash: string,
    inputs: UTxO[],
    outputs: UTxO[],
};

export type AssetAddress = {
    address: string,
    quantity: bigint,
}

export type DefinitionBytes = {
    bytes: string | DatumParameterKey,
}

export type DefinitionInt = {
    int: number | DatumParameterKey,
}

export type DefinitionField = DefinitionConstr | DefinitionBytes | DefinitionInt | DefinitionField[] | Function

export type DefinitionConstr = {
    constructor: number | DatumParameterKey,
    fields: DefinitionField[],
}

export type WalletOptions = {
    addressType?: AddressType,
    accountIndex?: number,
}

export type SpendUTxO = {
    utxo: UTxO,
    redeemer?: string,
    validator?: Script,
    signer?: string,
};

export type PayToAddress = {
    address: string,
    addressType: AddressType,
    assetBalances: AssetBalance[],
    spendUtxos?: SpendUTxO[],
    datum?: string,
    isInlineDatum: boolean,
};

export type SwapFee = {
    id: string,
    title: string,
    description: string,
    value: bigint,
    isReturned: boolean,
};

export type SwapInAmountMapping = {
    swapInAmount: bigint,
    liquidityPool: LiquidityPool,
}

export type SwapOutAmountMapping = {
    swapOutAmount: bigint,
    liquidityPool: LiquidityPool,
}

export type SplitCancelSwapMapping = {
    txHash: string,
    dex: string,
}

export type DexTransactionError = {
    step: TransactionStatus,
    reason: string,
    reasonRaw: string,
};

export type AssetMetadata = {
    policyId: string,
    nameHex: string,
    decimals: number,
};

export type Cip30Api = {
    getNetworkId(): Promise<number>;
    getUtxos(): Promise<string[] | undefined>;
    getBalance(): Promise<string>;
    getUsedAddresses(): Promise<string[]>;
    getUnusedAddresses(): Promise<string[]>;
    getChangeAddress(): Promise<string>;
    getRewardAddresses(): Promise<string[]>;
    signTx(tx: string, partialSign: boolean): Promise<string>;
    signData(address: string, payload: string): Promise<{
        signature: string;
        key: string;
    }>;
    submitTx(tx: string): Promise<string>;
    getCollateral(): Promise<string[]>;
    experimental: {
        getCollateral(): Promise<string[]>;
        on(eventName: string, callback: (...args: unknown[]) => void): void;
        off(eventName: string, callback: (...args: unknown[]) => void): void;
    };
};
