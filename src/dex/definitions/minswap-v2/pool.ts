import { DatumParameterKey } from '@app/constants';
import { DatumParameters, DefinitionField } from '@app/types';

/**
 * https://github.com/minswap/minswap-dex-v2/blob/main/src/types/pool.ts
 */
export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        (field: DefinitionField, parameters: DatumParameters, shouldExtract: boolean = true) => {
          return;
        },
      ]
    },
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
    },
    {
      int: DatumParameterKey.TotalLpTokens
    },
    {
      int: DatumParameterKey.ReserveA
    },
    {
      int: DatumParameterKey.ReserveB
    },
    {
      int: DatumParameterKey.BaseFee
    },
    {
      int: DatumParameterKey.FeeSharingNumerator
    },
    (field: DefinitionField, parameters: DatumParameters, shouldExtract: boolean = true) => {
      return;
    },
  ]
}