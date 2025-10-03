import { C, fromHex, Lucid, toHex, Utils } from 'lucid-cardano';
import { encoder } from 'js-encoding-utils';
export const lucidUtils = new Utils(new Lucid());
export function tokensMatch(tokenA, tokenB) {
    const tokenAId = tokenA === 'lovelace' ? 'lovelace' : tokenA.identifier();
    const tokenBId = tokenB === 'lovelace' ? 'lovelace' : tokenB.identifier();
    return tokenAId === tokenBId;
}
export function correspondingReserves(liquidityPool, token) {
    if (!liquidityPool.state)
        return [0n, 0n];
    return tokensMatch(token, liquidityPool.tokenA)
        ? [liquidityPool.state.reserveA, liquidityPool.state.reserveB]
        : [liquidityPool.state.reserveB, liquidityPool.state.reserveA];
}
export function appendSlash(value) {
    if (!value)
        return '';
    if (value.endsWith('/'))
        return;
    return `${value}/`;
}
/**
 * Modified version from lucid
 */
export function datumJsonToCbor(json) {
    const convert = (json) => {
        if (!isNaN(json.int)) {
            return C.PlutusData.new_integer(C.BigInt.from_str(json.int.toString()));
        }
        else if (json.bytes || !isNaN(Number(json.bytes))) {
            return C.PlutusData.new_bytes(fromHex(json.bytes));
        }
        else if (json.map) {
            const l = C.PlutusList.new();
            json.forEach((v) => {
                l.add(convert(v));
            });
            return C.PlutusData.new_list(l);
        }
        else if (json.list) {
            const l = C.PlutusList.new();
            json.list.forEach((v) => {
                l.add(convert(v));
            });
            return C.PlutusData.new_list(l);
        }
        else if (!isNaN(json.constructor)) {
            const l = C.PlutusList.new();
            json.fields.forEach((v) => {
                l.add(convert(v));
            });
            return C.PlutusData.new_constr_plutus_data(C.ConstrPlutusData.new(C.BigNum.from_str(json.constructor.toString()), l));
        }
        throw new Error("Unsupported type");
    };
    return toHex(convert(json).to_bytes());
}
export const bytesToHex = (bytes) => encoder.arrayBufferToHexString(bytes);
export const hexToBytes = (hex) => encoder.hexStringToArrayBuffer(hex);
