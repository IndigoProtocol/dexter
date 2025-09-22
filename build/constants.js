export var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Message"] = 674] = "Message";
})(MetadataKey || (MetadataKey = {}));
export var DatumParameterKey;
(function (DatumParameterKey) {
    /**
     * Generics.
     */
    DatumParameterKey["Action"] = "Action";
    DatumParameterKey["TokenPolicyId"] = "TokenPolicyId";
    DatumParameterKey["TokenAssetName"] = "TokenAssetName";
    DatumParameterKey["ReserveA"] = "ReserveA";
    DatumParameterKey["ReserveB"] = "ReserveB";
    DatumParameterKey["CancelDatum"] = "CancelDatum";
    DatumParameterKey["AScale"] = "AScale";
    DatumParameterKey["BScale"] = "BScale";
    /**
     * Swap/wallet info.
     */
    DatumParameterKey["Address"] = "Address";
    DatumParameterKey["SenderPubKeyHash"] = "SenderPubKeyHash";
    DatumParameterKey["SenderStakingKeyHash"] = "SenderStakingKeyHash";
    DatumParameterKey["SenderKeyHashes"] = "SenderKeyHashes";
    DatumParameterKey["ReceiverPubKeyHash"] = "ReceiverPubKeyHash";
    DatumParameterKey["ReceiverStakingKeyHash"] = "ReceiverStakingKeyHash";
    DatumParameterKey["SwapInAmount"] = "SwapInAmount";
    DatumParameterKey["SwapInTokenPolicyId"] = "SwapInTokenPolicyId";
    DatumParameterKey["SwapInTokenAssetName"] = "SwapInTokenAssetName";
    DatumParameterKey["SwapOutTokenPolicyId"] = "SwapOutTokenPolicyId";
    DatumParameterKey["SwapOutTokenAssetName"] = "SwapOutTokenAssetName";
    DatumParameterKey["MinReceive"] = "MinReceive";
    DatumParameterKey["Expiration"] = "Expiration";
    DatumParameterKey["AllowPartialFill"] = "AllowPartialFill";
    DatumParameterKey["Direction"] = "Direction";
    DatumParameterKey["FeePaymentKeyHash"] = "FeePaymentKeyHash";
    DatumParameterKey["Beacon"] = "Beacon";
    DatumParameterKey["Batcher"] = "Batcher";
    DatumParameterKey["InToken"] = "InToken";
    /**
     * Trading fees.
     */
    DatumParameterKey["TotalFees"] = "TotalFees";
    DatumParameterKey["BatcherFee"] = "BatcherFee";
    DatumParameterKey["DepositFee"] = "DepositFee";
    DatumParameterKey["ScooperFee"] = "ScooperFee";
    DatumParameterKey["BaseFee"] = "BaseFee";
    DatumParameterKey["ExecutionFee"] = "ExecutionFee";
    DatumParameterKey["FeeSharingNumerator"] = "FeeSharingNumerator";
    DatumParameterKey["OpeningFee"] = "OpeningFee";
    DatumParameterKey["FinalFee"] = "FinalFee";
    DatumParameterKey["FeesFinalized"] = "FeesFinalized";
    DatumParameterKey["MarketOpen"] = "MarketOpen";
    DatumParameterKey["ProtocolFee"] = "ProtocolFee";
    DatumParameterKey["SwapFee"] = "SwapFee";
    DatumParameterKey["ProjectFeeInBasis"] = "ProjectFeeInBasis";
    DatumParameterKey["ReserveFeeInBasis"] = "ReserveFeeInBasis";
    DatumParameterKey["FeeBasis"] = "FeeBasis";
    DatumParameterKey["AgentFee"] = "AgentFee";
    /**
     * LP info.
     */
    DatumParameterKey["PoolIdentifier"] = "PoolIdentifier";
    DatumParameterKey["TotalLpTokens"] = "TotalLpTokens";
    DatumParameterKey["LpTokenPolicyId"] = "LpTokenPolicyId";
    DatumParameterKey["LpTokenAssetName"] = "LpTokenAssetName";
    DatumParameterKey["LpFee"] = "LpFee";
    DatumParameterKey["LpFeeNumerator"] = "LpFeeNumerator";
    DatumParameterKey["LpFeeDenominator"] = "LpFeeDenominator";
    DatumParameterKey["PoolAssetAPolicyId"] = "PoolAssetAPolicyId";
    DatumParameterKey["PoolAssetAAssetName"] = "PoolAssetAAssetName";
    DatumParameterKey["PoolAssetATreasury"] = "PoolAssetATreasury";
    DatumParameterKey["PoolAssetABarFee"] = "PoolAssetABarFee";
    DatumParameterKey["PoolAssetBPolicyId"] = "PoolAssetBPolicyId";
    DatumParameterKey["PoolAssetBAssetName"] = "PoolAssetBAssetName";
    DatumParameterKey["PoolAssetBTreasury"] = "PoolAssetBTreasury";
    DatumParameterKey["PoolAssetBBarFee"] = "PoolAssetBBarFee";
    DatumParameterKey["RootKLast"] = "RootKLast";
    DatumParameterKey["LastInteraction"] = "LastInteraction";
    DatumParameterKey["RequestScriptHash"] = "RequestScriptHash";
    DatumParameterKey["StakeAdminPolicy"] = "StakeAdminPolicy";
    DatumParameterKey["LqBound"] = "LqBound";
    DatumParameterKey["Unknown"] = "Unknown";
})(DatumParameterKey || (DatumParameterKey = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["Building"] = 0] = "Building";
    TransactionStatus[TransactionStatus["Signing"] = 1] = "Signing";
    TransactionStatus[TransactionStatus["Submitting"] = 2] = "Submitting";
    TransactionStatus[TransactionStatus["Submitted"] = 3] = "Submitted";
    TransactionStatus[TransactionStatus["Errored"] = 4] = "Errored";
})(TransactionStatus || (TransactionStatus = {}));
export var AddressType;
(function (AddressType) {
    AddressType[AddressType["Contract"] = 0] = "Contract";
    AddressType[AddressType["Base"] = 1] = "Base";
    AddressType[AddressType["Enterprise"] = 2] = "Enterprise";
})(AddressType || (AddressType = {}));
