import { DatumParameterKey } from '@app/constants';

export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.PoolIdentifier,
        },
      ],
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.SenderStakingKeyHash,
        },
      ],
    },
    {
      int: DatumParameterKey.ProtocolFee,
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
                },
              ],
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
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          constructor: 0,
          fields: [],
        },
      ],
    },
    {
      constructor: 1,
      fields: [
        [
          {
            bytes: DatumParameterKey.SwapInTokenPolicyId,
          },
          {
            bytes: DatumParameterKey.SwapInTokenAssetName,
          },
          {
            int: DatumParameterKey.SwapInAmount,
          },
        ],
        [
          {
            bytes: DatumParameterKey.SwapOutTokenPolicyId,
          },
          {
            bytes: DatumParameterKey.SwapOutTokenAssetName,
          },
          {
            int: DatumParameterKey.MinReceive,
          },
        ],
      ],
    },
    {
      bytes: DatumParameterKey.CancelDatum,
    },
  ],
};
