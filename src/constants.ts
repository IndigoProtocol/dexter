export const DEFINITION_ROOT: string = './dex/definitions';

export enum DatumParameterKey {
    PubKeyHash = 'PubKeyHash',
    StakingKeyHash = 'StakingKeyHash',
    MinReceive = 'MinReceive',
    SwapInTokenPolicyId = 'SwapInTokenPolicyId',
    SwapInTokenAssetName = 'SwapInTokenAssetName',
    SwapOutTokenPolicyId = 'SwapOutTokenPolicyId',
    SwapOutTokenAssetName = 'SwapOutTokenAssetName',

    TotalLpTokens = 'TotalLpTokens',

    BatcherFee = 'BatcherFee',
    DepositFee = 'DepositFee',

    PoolAssetAPolicyId = 'PoolAssetAPolicyId',
    PoolAssetAAssetName = 'PoolAssetAAssetName',
    PoolAssetBPolicyId = 'PoolAssetBPolicyId',
    PoolAssetBAssetName = 'PoolAssetBAssetName',
    RootKLast = 'RootKLast',

    Unknown = 'Unknown',
}