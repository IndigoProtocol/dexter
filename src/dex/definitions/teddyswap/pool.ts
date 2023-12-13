import { DatumParameterKey } from '@app/constants';

export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.TokenPolicyId // Pool NFT
        },
        {
          bytes: DatumParameterKey.TokenAssetName
        }
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
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.LpTokenPolicyId
        },
        {
          bytes: DatumParameterKey.LpTokenAssetName
        }
      ]
    },
    {
      int: DatumParameterKey.LpFee
    },
    [
      {
        bytes: DatumParameterKey.StakeAdminPolicy
      }
    ],
    {
      int: DatumParameterKey.LqBound
    }
  ]
}
