import { C, Datum, fromHex, Lucid, toHex, Utils } from 'lucid-cardano';
import { DatumJson } from '@app/types';
import { encoder } from 'js-encoding-utils';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';
import { AddressType } from './constants';

export const lucidUtils: Utils = new Utils(new Lucid());

export function tokensMatch(tokenA: Token, tokenB: Token): boolean {
    const tokenAId: string = tokenA === 'lovelace' ? 'lovelace' : tokenA.identifier();
    const tokenBId: string = tokenB === 'lovelace' ? 'lovelace' : tokenB.identifier();

    return tokenAId === tokenBId;
}

export function correspondingReserves(liquidityPool: LiquidityPool, token: Token): bigint[] {
    if (! liquidityPool.state) return [0n, 0n];

    return tokensMatch(token, liquidityPool.tokenA)
        ? [liquidityPool.state.reserveA, liquidityPool.state.reserveB]
        : [liquidityPool.state.reserveB, liquidityPool.state.reserveA]
}

export function appendSlash(value?: string) {
    if (! value) return '';
    if (value.endsWith('/')) return;

    return `${value}/`;
}

/**
 * Modified version from lucid
 */
export function datumJsonToCbor(json: DatumJson): Datum {
    const convert = (json: DatumJson): C.PlutusData => {
        if (!isNaN(json.int!)) {
            return C.PlutusData.new_integer(C.BigInt.from_str(json.int!.toString()));
        } else if (json.bytes || !isNaN(Number(json.bytes))) {
            return C.PlutusData.new_bytes(fromHex(json.bytes!));
        } else if (json.map) {
            const l = C.PlutusList.new();
            (json as any).forEach((v: DatumJson) => {
                l.add(convert(v));
            });
            return C.PlutusData.new_list(l);
        } else if (json.list) {
            const l = C.PlutusList.new();
            json.list.forEach((v: DatumJson) => {
                l.add(convert(v));
            });
            return C.PlutusData.new_list(l);
        } else if (!isNaN(json.constructor! as unknown as number)) {
            const l = C.PlutusList.new();
            json.fields!.forEach((v: DatumJson) => {
                l.add(convert(v));
            });
            return C.PlutusData.new_constr_plutus_data(
                C.ConstrPlutusData.new(
                    C.BigNum.from_str(json.constructor!.toString()),
                    l,
                ),
            );
        }
        throw new Error("Unsupported type");
    };

    return toHex(convert(json).to_bytes());
}

export function determineAddressType(address: string): AddressType {
    const details = lucidUtils.getAddressDetails(address);

    if (details.type === 'Enterprise') {
        return AddressType.Enterprise;
    }

    return AddressType.Base;
}

export const bytesToHex = (bytes: Uint8Array): string => encoder.arrayBufferToHexString(bytes);
export const hexToBytes = (hex: string): Uint8Array => encoder.hexStringToArrayBuffer(hex);