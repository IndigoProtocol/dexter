import { DatumParameterKey } from '@app/constants';

export default {
  constructor: 0,
  fields: [
    {
      bytes: DatumParameterKey.PoolIdentifier,
    },
    {
      list: [
        {
          list: [
            {
              bytes: DatumParameterKey.PoolAssetAPolicyId
            },
            {
              bytes: DatumParameterKey.PoolAssetAAssetName
            }
          ],
        },
        {
          list: [
            {
              bytes: DatumParameterKey.PoolAssetBPolicyId
            },
            {
              bytes: DatumParameterKey.PoolAssetBAssetName
            }
          ],
        },
      ],
    },
    {
      int: DatumParameterKey.TotalLpTokens
    },
    {
      list: [
        {
          int: DatumParameterKey.OpeningFee
        },
        {
          int: DatumParameterKey.FinalFee
        }
      ],
    },
    {
      list: [
        {
          int: DatumParameterKey.OpeningFee
        },
        {
          int: DatumParameterKey.FinalFee
        }
      ],
    },
    {
      fields: [],
      constructor: 1,
    },
    {
      int: DatumParameterKey.MarketOpen
    },
    {
      int: DatumParameterKey.FeesFinalized
    },
    {
      int: DatumParameterKey.ProtocolFee
    },
  ],
};
