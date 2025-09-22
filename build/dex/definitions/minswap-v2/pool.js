import { DatumParameterKey } from '../../../constants.js';
/**
 * https://github.com/minswap/minswap-dex-v2/blob/main/src/types/pool.ts
 */
export default {
    constructor: 0,
    fields: [
        {
            constructor: 0,
            fields: [
                (field, parameters, shouldExtract = true) => {
                    return;
                },
            ]
        },
        {
            constructor: 0,
            fields: [
                {
                    bytes: DatumParameterKey.PoolAssetAPolicyId
                },
                {
                    bytes: DatumParameterKey.PoolAssetAAssetName
                }
            ]
        },
        {
            constructor: 0,
            fields: [
                {
                    bytes: DatumParameterKey.PoolAssetBPolicyId
                },
                {
                    bytes: DatumParameterKey.PoolAssetBAssetName
                }
            ]
        },
        {
            int: DatumParameterKey.TotalLpTokens
        },
        {
            int: DatumParameterKey.ReserveA
        },
        {
            int: DatumParameterKey.ReserveB
        },
        {
            int: DatumParameterKey.BaseFee
        },
        {
            int: DatumParameterKey.FeeSharingNumerator
        },
        (field, parameters, shouldExtract = true) => {
            return;
        },
    ]
};
