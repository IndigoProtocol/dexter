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
              bytes: DatumParameterKey.PubKeyHash,
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
                      bytes: DatumParameterKey.StakingKeyHash,
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
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: DatumParameterKey.PubKeyHash,
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
                      bytes: DatumParameterKey.StakingKeyHash,
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
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: DatumParameterKey.SwapOutTokenPolicyId
            },
            {
              bytes: DatumParameterKey.SwapOutTokenAssetName
            }
          ]
        },
        {
          int: DatumParameterKey.MinReceive
        }
      ]
    },
    {
      int: DatumParameterKey.BatcherFee
    },
    {
      int: DatumParameterKey.DepositFee
    }
  ]
}