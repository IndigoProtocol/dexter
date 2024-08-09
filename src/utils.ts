import { Token } from '@dex/models/asset';
import { LiquidityPool } from '@dex/models/liquidity-pool';
import { C, Datum, fromHex, Lucid, toHex, Utils } from 'lucid-cardano';
import { DatumJson } from '@app/types';

export const lucidUtils: Utils = new Utils(new Lucid());

export function tokensMatch(tokenA: Token, tokenB: Token): boolean {
    const tokenAId: string = tokenA === 'lovelace' ? 'lovelace' : tokenA.identifier();
    const tokenBId: string = tokenB === 'lovelace' ? 'lovelace' : tokenB.identifier();

    return tokenAId === tokenBId;
}

export function correspondingReserves(liquidityPool: LiquidityPool, token: Token): bigint[] {
    return tokensMatch(token, liquidityPool.assetA)
        ? [liquidityPool.reserveA, liquidityPool.reserveB]
        : [liquidityPool.reserveB, liquidityPool.reserveA]
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