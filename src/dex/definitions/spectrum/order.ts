import { DatumParameterKey } from '@app/constants';

/**
 * https://github.com/spectrum-finance/cardano-dex-contracts/blob/master/cardano-dex-contracts-offchain/ErgoDex/Contracts/Proxy/Swap.hs
 */
export default {
  constructor: 0,
  fields: [
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.SwapInTokenPolicyId,
        },
        {
          bytes: DatumParameterKey.SwapInTokenAssetName,
        },
      ],
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.SwapOutTokenPolicyId,
        },
        {
          bytes: DatumParameterKey.SwapOutTokenAssetName,
        },
      ],
    },
    {
      constructor: 0,
      fields: [
        {
          bytes: DatumParameterKey.TokenPolicyId, // Pool NFT
        },
        {
          bytes: DatumParameterKey.TokenAssetName,
        },
      ],
    },
    {
      int: DatumParameterKey.LpFee,
    },
    {
      int: DatumParameterKey.LpFeeNumerator,
    },
    {
      int: DatumParameterKey.LpFeeDenominator,
    },
    {
      bytes: DatumParameterKey.SenderPubKeyHash,
    },
    {
      fields: [
        {
          bytes: DatumParameterKey.SenderStakingKeyHash,
        },
      ],
      constructor: 0,
    },
    {
      int: DatumParameterKey.SwapInAmount,
    },
    {
      int: DatumParameterKey.MinReceive,
    },
  ],
};
