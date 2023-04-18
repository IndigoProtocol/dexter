import { DatumParameterKey } from '../../../constants';

export default {
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
    },
    {
      int: DatumParameterKey.TotalLpTokens
    },
    {
      int: DatumParameterKey.RootKLast
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
                  constructor: 0,
                  fields: [
                    {
                      bytes: DatumParameterKey.PubKeyHash
                    }
                  ]
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
                              bytes: DatumParameterKey.StakingKeyHash
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              constructor: 1,
              fields: []
            }
          ]
        }
      ]
    }
  ]
}