import { DatumParameterKey } from '../../../constants';

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
          bytes: DatumParameterKey.SwapOutTokenPolicyId
        },
        {
          bytes: DatumParameterKey.SwapOutTokenAssetName
        },
        {
          bytes: DatumParameterKey.SwapInTokenPolicyId
        },
        {
          bytes: DatumParameterKey.SwapInTokenAssetName
        },
        {
          // minReceive - matchMakerFee - deposit
          int: DatumParameterKey.MinReceive
        },
        {
          constructor: 1,
          fields: []
        },
        {
          int: DatumParameterKey.TotalFees
        }
      ]
    }
  ]
}