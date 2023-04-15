import { DatumKey } from '../../src/constants';

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
              bytes: DatumKey.PubKeyHash,
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
                      bytes: DatumKey.StakingKeyHash,
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
              bytes: DatumKey.PubKeyHash,
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
                      bytes: DatumKey.StakingKeyHash,
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
              bytes: DatumKey.SwapOutTokenPolicyId,
            },
            {
              bytes: DatumKey.SwapOutTokenAssetName,
            }
          ]
        },
        {
          int: DatumKey.MinReceive,
        }
      ]
    },
    {
      int: DatumKey.BatcherFee,
    },
    {
      int: DatumKey.DepositFee,
    }
  ]
}