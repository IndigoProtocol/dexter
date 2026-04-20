import { DatumParameterKey } from '@app/constants';

/**
 * https://github.com/WingRiders/dex-serializer/blob/main/src/RequestDatum.ts
 */
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
                  bytes: DatumParameterKey.ReceiverPubKeyHash
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
                          bytes: DatumParameterKey.ReceiverStakingKeyHash
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
          bytes: DatumParameterKey.SenderPubKeyHash
        },
        {
          int: DatumParameterKey.Expiration
        },
        {
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
            }
          ]
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: DatumParameterKey.Action,
          fields: []
        },
        {
          int: DatumParameterKey.MinReceive
        }
      ]
    }
  ]
};