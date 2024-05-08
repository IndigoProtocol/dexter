import { DatumParameterKey } from '@app/constants';
import { DefinitionField, DefinitionList } from '@app/types';

export default {
  constructor: 0,
  fields: [
    {
      bytes: DatumParameterKey.PoolIdentifier,
    },
    {
      list: [
        {
          list: [{ bytes: DatumParameterKey.PoolAssetAPolicyId }, { bytes: DatumParameterKey.PoolAssetAAssetName }] as DefinitionList,
        },
        {
          list: [{ bytes: DatumParameterKey.PoolAssetBPolicyId }, { bytes: DatumParameterKey.PoolAssetBAssetName }] as DefinitionList,
        },
      ] as unknown as DefinitionList,
    },
    { int: DatumParameterKey.TotalLpTokens },
    {
      list: [{ int: DatumParameterKey.OpeningFee }, { int: DatumParameterKey.FinalFee }] as DefinitionList, // Need to confirm these?
    },
    {
      list: [{ int: DatumParameterKey.OpeningFee }, { int: DatumParameterKey.FinalFee }] as DefinitionList, // Need to confirm these?
    },
    {
      fields: [],
      constructor: 1,
    },
    { int: DatumParameterKey.MarketOpen },
    { int: DatumParameterKey.FeesFinalized },
    { int: DatumParameterKey.ProtocolFee },
  ] as DefinitionField[],
};
