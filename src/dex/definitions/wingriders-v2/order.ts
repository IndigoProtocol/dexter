import { DatumParameterKey } from '@app/constants';

export default {
  constructor: 0,
  fields: [
    {
      int: DatumParameterKey.DepositFee
    },
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
    [],
    {
      constructor: 0,
      fields: []
    },
    {
      int: DatumParameterKey.Expiration
    },
    {
      bytes: DatumParameterKey.PoolAssetAPolicyId
    },
    {
      bytes: DatumParameterKey.PoolAssetAAssetName
    },
    {
      bytes: DatumParameterKey.PoolAssetBPolicyId
    },
    {
      bytes: DatumParameterKey.PoolAssetBAssetName
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
    },
    {
      int: DatumParameterKey.AScale
    },
    {
      int: DatumParameterKey.BScale
    }
  ]
};