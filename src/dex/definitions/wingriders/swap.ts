import { DatumParameterKey } from '../../../constants';

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
                  bytes: ""
                },
                {
                  bytes: ""
                }
              ]
            },
            {
              constructor: 0,
              fields: [
                {
                  bytes: DatumParameterKey.TokenPolicyId
                },
                {
                  bytes: DatumParameterKey.TokenAssetName
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