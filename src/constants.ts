export enum MetadataKey {
    Message = 674,
}

export enum DatumParameterKey {
    /**
     * Generics.
     */
    Action = 'Action',
    TokenPolicyId = 'TokenPolicyId',
    TokenAssetName = 'TokenAssetName',

    /**
     * Swap/wallet info.
     */
    SenderPubKeyHash = 'SenderPubKeyHash',
    SenderStakingKeyHash = 'SenderStakingKeyHash',
    SenderKeyHashes = 'SenderKeyHashes',
    ReceiverPubKeyHash = 'ReceiverPubKeyHash',
    ReceiverStakingKeyHash = 'ReceiverStakingKeyHash',
    SwapInAmount = 'SwapInAmount',
    SwapInTokenPolicyId = 'SwapInTokenPolicyId',
    SwapInTokenAssetName = 'SwapInTokenAssetName',
    SwapOutTokenPolicyId = 'SwapOutTokenPolicyId',
    SwapOutTokenAssetName = 'SwapOutTokenAssetName',
    MinReceive = 'MinReceive',
    Expiration = 'Expiration',
    AllowPartialFill = 'AllowPartialFill',

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
    LpTokenPolicyId = 'LpTokenPolicyId',
    LpTokenAssetName = 'LpTokenAssetName',
    LpFee = 'LpFee',
    LpFeeNumerator = 'LpFeeNumerator',
    LpFeeDenominator = 'LpFeeDenominator',
    PoolAssetAPolicyId = 'PoolAssetAPolicyId',
    PoolAssetAAssetName = 'PoolAssetAAssetName',
    PoolAssetATreasury = 'PoolAssetATreasury',
    PoolAssetABarFee = 'PoolAssetABarFee',
    PoolAssetBPolicyId = 'PoolAssetBPolicyId',
    PoolAssetBAssetName = 'PoolAssetBAssetName',
    PoolAssetBTreasury = 'PoolAssetBTreasury',
    PoolAssetBBarFee = 'PoolAssetBBarFee',
    RootKLast = 'RootKLast',
    LastInteraction = 'LastInteraction',
    RequestScriptHash = 'RequestScriptHash',
    StakeAdminPolicy = 'StakeAdminPolicy',
    LqBound = 'LqBound',
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
    Base,
    Enterprise,
}
