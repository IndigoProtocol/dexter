export const DEFINITION_ROOT: string = './dex/definitions';

export enum DatumParameterKey {
    /**
     * Swap/wallet info.
     */
    PubKeyHash = 'PubKeyHash',
    StakingKeyHash = 'StakingKeyHash',
    SwapDirection = 'SwapDirection',
    SwapInAmount = 'SwapInAmount',
    SwapInTokenPolicyId = 'SwapInTokenPolicyId',
    SwapInTokenAssetName = 'SwapInTokenAssetName',
    SwapOutTokenPolicyId = 'SwapOutTokenPolicyId',
    SwapOutTokenAssetName = 'SwapOutTokenAssetName',
    MinReceive = 'MinReceive',

    /**
     * Trading fees.
     */
    BatcherFee = 'BatcherFee',
    DepositFee = 'DepositFee',
    ScooperFee = 'ScooperFee',

    /**
     * LP info.
     */
    PoolIdentifier = 'PoolIdentifier',
    TotalLpTokens = 'TotalLpTokens',
    LpFeeNumerator = 'LpFeeNumerator',
    LpFeeDenominator = 'LpFeeDenominator',
    PoolAssetAPolicyId = 'PoolAssetAPolicyId',
    PoolAssetAAssetName = 'PoolAssetAAssetName',
    PoolAssetBPolicyId = 'PoolAssetBPolicyId',
    PoolAssetBAssetName = 'PoolAssetBAssetName',
    RootKLast = 'RootKLast',
}