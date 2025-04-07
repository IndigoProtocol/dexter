import { DatumParameterKey } from '@app/constants';

/**
 * https://github.com/WingRiders/dex-serializer/blob/main/src/LiquidityPoolDatum.ts
 */
export default {
  constructor: 0,
  fields: [
    {
      bytes: DatumParameterKey.RequestScriptHash
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              constructor: 0,
              fields: [
                {
                  bytes: DatumParameterKey.PoolAssetAPolicyId,
                },
                {
                  bytes: DatumParameterKey.PoolAssetAAssetName,
                }
              ]
            },
            {
              constructor: 0,
              fields: [
                {
                  bytes: DatumParameterKey.PoolAssetBPolicyId,
                },
                {
                  bytes: DatumParameterKey.PoolAssetBAssetName,
                }
              ]
            }
          ]
        },
        {
          int: DatumParameterKey.LastInteraction,
        },
        {
          int: DatumParameterKey.PoolAssetATreasury,
        },
        {
          int: DatumParameterKey.PoolAssetBTreasury,
        }
      ]
    }
  ]
};