import { DatumParameterKeys } from '../../../constants';

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
              bytes: DatumParameterKeys.PubKeyHash,
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
                      bytes: DatumParameterKeys.StakingKeyHash,
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
              bytes: DatumParameterKeys.PubKeyHash,
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
                      bytes: DatumParameterKeys.StakingKeyHash,
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
              bytes: DatumParameterKeys.SwapOutTokenPolicyId,
            },
            {
              bytes: DatumParameterKeys.SwapOutTokenAssetName,
            }
          ]
        },
        {
          int: DatumParameterKeys.MinReceive,
        }
      ]
    },
    {
      int: DatumParameterKeys.BatcherFee,
    },
    {
      int: DatumParameterKeys.DepositFee,
    }
  ]
}