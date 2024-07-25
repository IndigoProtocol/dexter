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
      int: "99000"
    },
    {
      int: "100"
    },
    {
      int: "3050507335"
    },
    {
      int: "19927279036"
    },
    [
      {
        constructor: 0,
        fields: [
          {
            constructor: 1,
            fields: [
              {
                bytes: "03511ad08fb2b9db4c2212a66830a3b5e54a082aad2b805bd3583b05"
              }
            ]
          }
        ]
      }
    ],
    {
      bytes: "75c4570eb625ae881b32a34c52b159f6f3f3f2c7aaabf5bac4688133"
    }
  ]
}
