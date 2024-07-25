import { DatumParameterKey } from '@app/constants';

/**
 * https://github.com/minswap/minswap-dex-v2/blob/main/src/types/order.ts
 */
export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.SenderPubKeyHash,
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
              bytes: DatumParameterKey.SenderPubKeyHash,
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
                      bytes: DatumParameterKey.SenderStakingKeyHash,
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
      fields: []
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: [
            {
              bytes: DatumParameterKey.SenderPubKeyHash,
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
                      bytes: DatumParameterKey.SenderPubKeyHash,
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
      fields: []
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
      constructor: 0,
      fields: [
        {
          constructor: 0,
          fields: []
        },
        {
          constructor: 0,
          fields: [
            {
              int: DatumParameterKey.SwapInAmount
            }
          ]
        },
        {
          int: DatumParameterKey.MinReceive
        },
        {
          constructor: 0,
          fields: []
        }
      ]
    },
    {
      int: DatumParameterKey.BatcherFee
    },
    {
      constructor: 1,
      fields: []
    }
  ]
}