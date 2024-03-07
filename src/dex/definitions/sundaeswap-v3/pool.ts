import { DatumParameterKey } from '@app/constants';

export default {
  constructor: 0,
  fields: [
    {
      bytes: DatumParameterKey.PoolIdentifier
    },
    [
      [
        {
          bytes: DatumParameterKey.PoolAssetAPolicyId
        },
        {
          bytes: DatumParameterKey.PoolAssetAAssetName
        }
      ],
      [
        {
          bytes: DatumParameterKey.PoolAssetBPolicyId
        },
        {
          bytes: DatumParameterKey.PoolAssetBAssetName
        }
      ]
    ],
    {
      int: DatumParameterKey.TotalLpTokens
    },
    [
      {
        int: DatumParameterKey.OpeningFee
      },
      {
        int: DatumParameterKey.FinalFee
      }
    ],
    {
      int: DatumParameterKey.FeesFinalized
    },
    {
      int: DatumParameterKey.MarketOpen
    },
    {
      int: "36925460726"
    }
  ]
}
