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
                  bytes: DatumParameterKey.SenderPubKeyHash
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
                          bytes: DatumParameterKey.SenderStakingKeyHash
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
          // matchMakerFee + deposit
          int: DatumParameterKey.TotalFees
        }
      ]
    }
  ]
}