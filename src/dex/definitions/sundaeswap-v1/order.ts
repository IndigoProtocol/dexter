import { DatumParameterKey } from '@app/constants';

export default {
  constructor: 0,
  fields: [
    {
      bytes: DatumParameterKey.PoolIdentifier
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
              constructor: 1,
              fields: []
            }
          ]
        },
        {
          constructor: 1,
          fields: []
        }
      ]
    },
    {
      int: DatumParameterKey.ScooperFee
    },
    {
      constructor: 0,
      fields: [
        {
          constructor: DatumParameterKey.Action,
          fields: []
        },
        {
          int: DatumParameterKey.SwapInAmount
        },
        {
          constructor: 0,
          fields: [
            {
              int: DatumParameterKey.MinReceive
            }
          ]
        }
      ]
    }
  ]
}