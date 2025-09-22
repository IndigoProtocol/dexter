import { Datum, Utils } from 'lucid-cardano';
import { DatumJson } from './types';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';
export declare const lucidUtils: Utils;
export declare function tokensMatch(tokenA: Token, tokenB: Token): boolean;
export declare function correspondingReserves(liquidityPool: LiquidityPool, token: Token): bigint[];
export declare function appendSlash(value?: string): string | undefined;
/**
 * Modified version from lucid
 */
export declare function datumJsonToCbor(json: DatumJson): Datum;
export declare const bytesToHex: (bytes: Uint8Array) => string;
export declare const hexToBytes: (hex: string) => Uint8Array;
