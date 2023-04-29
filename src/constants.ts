export const DEFINITION_ROOT: string = './dex/definitions';

export enum DatumParameterKey {
    /**
     * Swap/wallet info.
     */
    SenderPubKeyHash = 'SenderPubKeyHash',
    SenderStakingKeyHash = 'SenderStakingKeyHash',
    ReceiverPubKeyHash = 'ReceiverPubKeyHash',
    ReceiverStakingKeyHash = 'ReceiverStakingKeyHash',
    Action = 'Action',
    SwapInAmount = 'SwapInAmount',
    TokenPolicyId = 'TokenPolicyId',
    TokenAssetName = 'TokenAssetName',
    SwapInTokenPolicyId = 'SwapInTokenPolicyId',
    SwapInTokenAssetName = 'SwapInTokenAssetName',
    SwapOutTokenPolicyId = 'SwapOutTokenPolicyId',
    SwapOutTokenAssetName = 'SwapOutTokenAssetName',
    MinReceive = 'MinReceive',
    Expiration = 'Expiration',

    /**
     * Trading fees.
     */
    TotalFees = 'TotalFees',
    BatcherFee = 'BatcherFee',
    DepositFee = 'DepositFee',
    ScooperFee = 'ScooperFee',

    /**
     * LP info.
     */
    PoolIdentifier = 'PoolIdentifier',
    TotalLpTokens = 'TotalLpTokens',
    LpFee = 'LpFee',
    LpFeeNumerator = 'LpFeeNumerator',
    LpFeeDenominator = 'LpFeeDenominator',
    PoolAssetAPolicyId = 'PoolAssetAPolicyId',
    PoolAssetAAssetName = 'PoolAssetAAssetName',
    PoolAssetBPolicyId = 'PoolAssetBPolicyId',
    PoolAssetBAssetName = 'PoolAssetBAssetName',
    RootKLast = 'RootKLast',
}

export enum TransactionStatus {
    Building,
    Signing,
    Submitting,
    Submitted,
    Errored,
}

export enum AddressType {
    Contract,
    Address,
}