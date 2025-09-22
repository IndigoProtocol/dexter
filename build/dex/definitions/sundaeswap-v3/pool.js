import { DatumParameterKey } from '../../../constants';
export default {
    constructor: 0,
    fields: [
        {
            bytes: DatumParameterKey.PoolIdentifier,
        },
        {
            list: [
                {
                    list: [
                        {
                            bytes: DatumParameterKey.PoolAssetAPolicyId
                        },
                        {
                            bytes: DatumParameterKey.PoolAssetAAssetName
                        }
                    ],
                },
                {
                    list: [
                        {
                            bytes: DatumParameterKey.PoolAssetBPolicyId
                        },
                        {
                            bytes: DatumParameterKey.PoolAssetBAssetName
                        }
                    ],
                },
            ],
        },
        {
            int: DatumParameterKey.TotalLpTokens
        },
        {
            int: DatumParameterKey.OpeningFee
        },
        {
            int: DatumParameterKey.FinalFee
        },
        (field, parameters, shouldExtract = true) => {
            return;
        },
    ],
};
