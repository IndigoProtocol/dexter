import { DatumParameterKey } from '@app/constants';
import { DatumParameters, DefinitionField } from '@app/types';

export default {
  constructor: 0,
  fields: [
    {
      bytes: DatumParameterKey.Action
    },
    {
      bytes: DatumParameterKey.Beacon
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.SwapInTokenPolicyId
        },
        {
          bytes: DatumParameterKey.SwapInTokenAssetName
        }
      ]
    },
    {
      int: DatumParameterKey.SwapInAmount
    },
    {
      int: DatumParameterKey.BaseFee
    },
    {
      int: DatumParameterKey.MinReceive
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.SwapOutTokenPolicyId
        },
        {
          bytes: DatumParameterKey.SwapOutTokenAssetName
        }
      ]
    },
    {
      constructor: 0,
      fields: [
        {
          int: DatumParameterKey.LpFeeNumerator,
        },
        {
          int: DatumParameterKey.LpFeeDenominator,
        }
      ]
    },
    {
      int: DatumParameterKey.ExecutionFee
    },
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
                (field: DefinitionField, parameters: DatumParameters, shouldExtract: boolean = true) => {
                  if (! shouldExtract) {
                    const stakeKeyHash: string = parameters[DatumParameterKey.SenderStakingKeyHash] as string ?? null;

                    if (! stakeKeyHash) return;

                    return {
                      constructor: 0,
                      fields: [
                        {
                          bytes: stakeKeyHash,
                        }
                      ],
                    };
                  }

                  if ('fields' in field) {
                    if (field.constructor === 1) return;

                    if (field.fields.length > 0 && 'bytes' in field.fields[0]) {
                      parameters[DatumParameterKey.SenderStakingKeyHash] = field.fields[0].bytes;
                    }
                  }

                  return;
                },
              ]
            }
          ]
        }
      ]
    },
    {
      bytes: DatumParameterKey.SenderPubKeyHash
    },
    [
      {
        bytes: DatumParameterKey.Batcher
      }
    ]
  ]
}
