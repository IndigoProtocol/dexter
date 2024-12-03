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
  ReserveA = 'ReserveA',
  ReserveB = 'ReserveB',
  CancelDatum = 'CancelDatum',
  AScale = 'AScale',
  BScale = 'BScale',

  /**
   * Swap/wallet info.
   */
  Address = 'Address',
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
  Direction = 'Direction',
  FeePaymentKeyHash = 'FeePaymentKeyHash',
  Beacon = 'Beacon',
  Batcher = 'Batcher',
  InToken = 'InToken',

  /**
   * Trading fees.
   */
  TotalFees = 'TotalFees',
  BatcherFee = 'BatcherFee',
  DepositFee = 'DepositFee',
  ScooperFee = 'ScooperFee',
  BaseFee = 'BaseFee',
  ExecutionFee = 'ExecutionFee',
  FeeSharingNumerator = 'FeeSharingNumerator',
  OpeningFee = 'OpeningFee',
  FinalFee = 'FinalFee',
  FeesFinalized = 'FeesFinalized',
  MarketOpen = 'MarketOpen',
  ProtocolFee = 'ProtocolFee',
  SwapFee = 'SwapFee',
  ProjectFeeInBasis = 'ProjectFeeInBasis',
  ReserveFeeInBasis = 'ReserveFeeInBasis',
  FeeBasis = 'FeeBasis',
  AgentFee = 'AgentFee',

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

  Unknown = 'Unknown',
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
