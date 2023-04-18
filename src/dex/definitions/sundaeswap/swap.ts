import { DatumParameterKey } from '../../../constants';

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
          constructor: DatumParameterKey.SwapDirection,
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