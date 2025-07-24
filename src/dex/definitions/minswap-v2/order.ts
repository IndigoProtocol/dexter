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
              bytes: DatumParameterKey.ReceiverPubKeyHash,
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
                      bytes: DatumParameterKey.ReceiverStakingKeyHash,
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
      constructor: DatumParameterKey.ReceiverDatumType, // none | inline | hash, none = 0, inline = 1, hash = 2
      fields: [
        // none = empty array
        // hash or inline = hash of incoming datum as first field in the array
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
      constructor: 0,
      fields: [
        {
          constructor: DatumParameterKey.Direction,
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