import { DatumParameterKey } from '../../../constants.js';
export default {
    constructor: 0,
    fields: [
        {
            bytes: DatumParameterKey.RequestScriptHash
        },
        {
            bytes: DatumParameterKey.PoolAssetAPolicyId,
        },
        {
            bytes: DatumParameterKey.PoolAssetAAssetName,
        },
        {
            bytes: DatumParameterKey.PoolAssetBPolicyId,
        },
        {
            bytes: DatumParameterKey.PoolAssetBAssetName,
        },
        {
            int: DatumParameterKey.SwapFee
        },
        {
            int: DatumParameterKey.ProtocolFee
        },
        {
            int: DatumParameterKey.ProjectFeeInBasis
        },
        {
            int: DatumParameterKey.ReserveFeeInBasis
        },
        {
            int: DatumParameterKey.FeeBasis
        },
        {
            int: DatumParameterKey.AgentFee
        },
        {
            int: DatumParameterKey.LastInteraction
        },
        {
            int: DatumParameterKey.PoolAssetATreasury
        },
        {
            int: DatumParameterKey.PoolAssetBTreasury
        },
        {
            int: DatumParameterKey.Unknown
        },
        {
            int: DatumParameterKey.Unknown
        },
        {
            int: DatumParameterKey.Unknown
        },
        {
            int: DatumParameterKey.Unknown
        },
        (field, parameters, shouldExtract = true) => {
            return parameters;
        },
        (field, parameters, shouldExtract = true) => {
            return parameters;
        },
        (field, parameters, shouldExtract = true) => {
            return parameters;
        },
    ]
};
