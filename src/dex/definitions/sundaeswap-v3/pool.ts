import { DatumParameterKey } from '@app/constants';

export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
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
        }
      ]
    },
    {
      bytes: DatumParameterKey.PoolIdentifier
    },
    {
      int: DatumParameterKey.TotalLpTokens
    },
    {
      constructor: 0,
      fields: [
        {
          int: DatumParameterKey.LpFeeNumerator
        },
        {
          int: DatumParameterKey.LpFeeDenominator
        }
      ]
    }
  ]
}