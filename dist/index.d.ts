import { LiquidityPool, Token, Asset } from '@indigo-labs/iris-sdk';
import { Script, Utils, Datum, Network } from 'lucid-cardano';

declare enum MetadataKey {
    Message = 674
}
declare enum DatumParameterKey {
    /**
     * Generics.
     */
    Action = "Action",
    TokenPolicyId = "TokenPolicyId",
    TokenAssetName = "TokenAssetName",
    ReserveA = "ReserveA",
    ReserveB = "ReserveB",
    CancelDatum = "CancelDatum",
    AScale = "AScale",
    BScale = "BScale",
    /**
     * Swap/wallet info.
     */
    Address = "Address",
    SenderPubKeyHash = "SenderPubKeyHash",
    SenderStakingKeyHash = "SenderStakingKeyHash",
    SenderKeyHashes = "SenderKeyHashes",
    ReceiverPubKeyHash = "ReceiverPubKeyHash",
    ReceiverStakingKeyHash = "ReceiverStakingKeyHash",
    ReceiverDatum = "ReceiverDatum",
    ReceiverDatumType = "ReceiverDatumType",
    SwapInAmount = "SwapInAmount",
    SwapInTokenPolicyId = "SwapInTokenPolicyId",
    SwapInTokenAssetName = "SwapInTokenAssetName",
    SwapOutTokenPolicyId = "SwapOutTokenPolicyId",
    SwapOutTokenAssetName = "SwapOutTokenAssetName",
    SwapAdditionalAdaOnOrder = "SwapAdditionalAdaOnOrder",
    MinReceive = "MinReceive",
    Expiration = "Expiration",
    AllowPartialFill = "AllowPartialFill",
    Direction = "Direction",
    FeePaymentKeyHash = "FeePaymentKeyHash",
    Beacon = "Beacon",
    Batcher = "Batcher",
    InToken = "InToken",
    /**
     * Trading fees.
     */
    TotalFees = "TotalFees",
    BatcherFee = "BatcherFee",
    DepositFee = "DepositFee",
    ScooperFee = "ScooperFee",
    BaseFee = "BaseFee",
    ExecutionFee = "ExecutionFee",
    FeeSharingNumerator = "FeeSharingNumerator",
    OpeningFee = "OpeningFee",
    FinalFee = "FinalFee",
    FeesFinalized = "FeesFinalized",
    MarketOpen = "MarketOpen",
    ProtocolFee = "ProtocolFee",
    SwapFee = "SwapFee",
    ProjectFeeInBasis = "ProjectFeeInBasis",
    ReserveFeeInBasis = "ReserveFeeInBasis",
    FeeBasis = "FeeBasis",
    AgentFee = "AgentFee",
    /**
     * LP info.
     */
    PoolIdentifier = "PoolIdentifier",
    TotalLpTokens = "TotalLpTokens",
    LpTokenPolicyId = "LpTokenPolicyId",
    LpTokenAssetName = "LpTokenAssetName",
    LpFee = "LpFee",
    LpFeeNumerator = "LpFeeNumerator",
    LpFeeDenominator = "LpFeeDenominator",
    PoolAssetAPolicyId = "PoolAssetAPolicyId",
    PoolAssetAAssetName = "PoolAssetAAssetName",
    PoolAssetATreasury = "PoolAssetATreasury",
    PoolAssetABarFee = "PoolAssetABarFee",
    PoolAssetBPolicyId = "PoolAssetBPolicyId",
    PoolAssetBAssetName = "PoolAssetBAssetName",
    PoolAssetBTreasury = "PoolAssetBTreasury",
    PoolAssetBBarFee = "PoolAssetBBarFee",
    RootKLast = "RootKLast",
    LastInteraction = "LastInteraction",
    RequestScriptHash = "RequestScriptHash",
    StakeAdminPolicy = "StakeAdminPolicy",
    LqBound = "LqBound",
    Unknown = "Unknown"
}
declare enum TransactionStatus {
    Building = 0,
    Signing = 1,
    Submitting = 2,
    Submitted = 3,
    Errored = 4
}
declare enum AddressType {
    Contract = 0,
    Base = 1,
    Enterprise = 2
}

declare abstract class BaseWalletProvider {
    abstract isWalletLoaded: boolean;
    abstract address(): string;
    abstract publicKeyHash(): string;
    abstract stakingKeyHash(): string;
    abstract loadWallet(walletApi: Cip30Api, config: any): Promise<BaseWalletProvider>;
    abstract loadWalletFromSeedPhrase(seed: string[], options: WalletOptions, config: any): Promise<BaseWalletProvider>;
    abstract createTransaction(): DexTransaction;
    abstract attachMetadata(transaction: DexTransaction, key: number, json: Object): DexTransaction;
    abstract paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;
    abstract signTransaction(transaction: DexTransaction): Promise<DexTransaction>;
    abstract submitTransaction(transaction: DexTransaction): Promise<string>;
}

interface TransactionCallback {
    (transaction: DexTransaction): void;
}
declare class DexTransaction {
    providerData: any;
    error: DexTransactionError | undefined;
    private _hash;
    private _isSigned;
    private _payments;
    private _walletProvider;
    private _currentStatus;
    private _listeners;
    constructor(walletProvider: BaseWalletProvider);
    get hash(): string;
    get isSigned(): boolean;
    get payments(): PayToAddress[];
    get status(): TransactionStatus;
    set status(status: TransactionStatus);
    attachMetadata(key: number, json: Object): DexTransaction;
    payToAddresses(payToAddresses: PayToAddress[]): Promise<DexTransaction>;
    sign(): Promise<DexTransaction>;
    submit(): Promise<DexTransaction>;
    onBuilding(callback: TransactionCallback): DexTransaction;
    onSigning(callback: TransactionCallback): DexTransaction;
    onSubmitting(callback: TransactionCallback): DexTransaction;
    onSubmitted(callback: TransactionCallback): DexTransaction;
    onError(callback: TransactionCallback): DexTransaction;
    onFinally(callback: TransactionCallback): DexTransaction;
    private addListener;
}

declare class SwapRequest {
    private _dexter;
    private _liquidityPool;
    private _swapInToken;
    private _swapOutToken;
    private _swapInAmount;
    private _slippagePercent;
    private _withUtxos;
    private _metadata;
    constructor(dexter: Dexter);
    get liquidityPool(): LiquidityPool;
    get swapInToken(): Token;
    get swapOutToken(): Token;
    get swapInAmount(): bigint;
    get slippagePercent(): number;
    forLiquidityPool(liquidityPool: LiquidityPool): SwapRequest;
    flip(): SwapRequest;
    withMetadata(metadata: string): SwapRequest;
    withSwapInToken(swapInToken: Token): SwapRequest;
    withSwapOutToken(swapOutToken: Token): SwapRequest;
    withSwapInAmount(swapInAmount: bigint): SwapRequest;
    withSwapOutAmount(swapOutAmount: bigint): SwapRequest;
    withMinimumReceive(minReceive: bigint): SwapRequest;
    withSlippagePercent(slippagePercent: number): SwapRequest;
    withUtxos(utxos: UTxO[]): SwapRequest;
    getEstimatedReceive(liquidityPool?: LiquidityPool): bigint;
    getMinimumReceive(liquidityPool?: LiquidityPool): bigint;
    getPriceImpactPercent(): number;
    getSwapFees(): SwapFee[];
    getPaymentsToAddresses(): Promise<PayToAddress[]>;
    submit(): DexTransaction;
    private sendSwapOrder;
}

declare class CancelSwapRequest {
    private _dexter;
    private _txHash;
    private _dexName;
    constructor(dexter: Dexter);
    forTransaction(txHash: string): CancelSwapRequest;
    forDex(name: string): CancelSwapRequest;
    getPaymentsToAddresses(): Promise<PayToAddress[]>;
    cancel(): DexTransaction;
    private sendCancelOrder;
}

declare class SplitSwapRequest {
    private _dexter;
    private _swapRequests;
    private _swapInToken;
    private _swapOutToken;
    private _slippagePercent;
    private _metadata;
    constructor(dexter: Dexter);
    get liquidityPools(): LiquidityPool[];
    get swapRequests(): SwapRequest[];
    get swapInToken(): Token;
    get swapOutToken(): Token;
    get swapInAmount(): bigint;
    get slippagePercent(): number;
    flip(): SplitSwapRequest;
    withMetadata(metadata: string): SplitSwapRequest;
    withSwapInToken(swapInToken: Token): SplitSwapRequest;
    withSwapOutToken(swapOutToken: Token): SplitSwapRequest;
    withSwapInAmountMappings(mappings: SwapInAmountMapping[]): SplitSwapRequest;
    withSwapOutAmountMappings(mappings: SwapOutAmountMapping[]): SplitSwapRequest;
    withSlippagePercent(slippagePercent: number): SplitSwapRequest;
    withUtxos(utxos: UTxO[]): SplitSwapRequest;
    getEstimatedReceive(): bigint;
    getMinimumReceive(): bigint;
    getAvgPriceImpactPercent(): number;
    getSwapFees(): SwapFee[];
    submit(): DexTransaction;
    private sendSplitSwapOrder;
    private isValidLiquidityPoolMappings;
}

declare class SplitCancelSwapRequest {
    private _dexter;
    private _cancelRequests;
    constructor(dexter: Dexter);
    forTransactions(mappings: SplitCancelSwapMapping[]): SplitCancelSwapRequest;
    submit(): DexTransaction;
    private sendSplitCancelSwapOrder;
}

declare abstract class BaseDataProvider {
    /**
     * Fetch all UTxOs for an address. Will filter on UTxOs containing
     * assetId (concatenation of policy ID & asset name) if provided.
     */
    abstract utxos(address: string, asset?: Asset): Promise<UTxO[]>;
    /**
     * Fetch all UTxOs for a transaction.
     */
    abstract transactionUtxos(txHash: string): Promise<UTxO[]>;
    /**
     * Fetch all transactions containing and asset.
     */
    abstract assetTransactions(asset: Asset): Promise<Transaction[]>;
    /**
     * Fetch all addresses containing an asset.
     */
    abstract assetAddresses(asset: Asset): Promise<AssetAddress[]>;
    /**
     * Fetch JSON value of a datum by its hash.
     */
    abstract datumValue(datumHash: string): Promise<DefinitionField>;
}

declare class Dexter {
    config: DexterConfig;
    requestConfig: RequestConfig;
    walletProvider?: BaseWalletProvider;
    dataProvider?: BaseDataProvider;
    availableDexs: AvailableDexs;
    constructor(config?: DexterConfig, requestConfig?: RequestConfig);
    /**
     * Retrieve DEX instance from unique name.
     */
    dexByName(name: string): BaseDex | undefined;
    /**
     * Switch to a new data provider.
     */
    withDataProvider(dataProvider: BaseDataProvider): Dexter;
    /**
     * Switch to a new wallet provider.
     */
    withWalletProvider(walletProvider: BaseWalletProvider): Dexter;
    /**
     * New request for a swap order.
     */
    newSwapRequest(): SwapRequest;
    /**
     * New request for a split swap order.
     */
    newSplitSwapRequest(): SplitSwapRequest;
    /**
     * New request for cancelling a swap order.
     */
    newCancelSwapRequest(): CancelSwapRequest;
    /**
     * New request for a split cancel swap order.
     */
    newSplitCancelSwapRequest(): SplitCancelSwapRequest;
}

declare abstract class BaseDex {
    protected dexter: Dexter;
    constructor(dexter: Dexter);
    /**
     * Estimated swap in amount given for a swap out token & amount on a liquidity pool.
     */
    abstract estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    /**
     * Estimated swap out amount received for a swap in token & amount on a liquidity pool.
     */
    abstract estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    /**
     * Calculated price impact after for swap order.
     */
    abstract priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    /**
     * Craft a swap order for this DEX.
     */
    abstract buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    /**
     * Craft a swap order cancellation for this DEX.
     */
    abstract buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    /**
     * Fees associated with submitting a swap order.
     */
    abstract swapOrderFees(liquidityPool?: LiquidityPool, swapInToken?: Token, swapInAmount?: bigint): SwapFee[];
    /**
     * Adjust the payment for the DEX order address to include the swap in amount.
     */
    protected buildSwapOrderPayment(swapParameters: DatumParameters, orderPayment: PayToAddress): PayToAddress;
}

interface DexterConfig {
    shouldFetchMetadata?: boolean;
    shouldFallbackToApi?: boolean;
    shouldSubmitOrders?: boolean;
    metadataMsgBranding?: string;
}
interface RequestConfig {
    timeout?: number;
    proxyUrl?: string;
    retries?: number;
}
interface BlockfrostConfig {
    url: string;
    projectId: string;
}
interface KupoConfig {
    url: string;
}
interface KupmiosConfig {
    kupoUrl: string;
    ogmiosUrl: string;
}
type AvailableDexs = {
    [dex: string]: BaseDex;
};
type DatumParameters = {
    [key in DatumParameterKey | string]?: string | number | bigint;
};
type AssetBalance = {
    asset: Token;
    quantity: bigint;
};
type UTxO = {
    txHash: string;
    address: string;
    datumHash: string;
    datum?: string;
    outputIndex: number;
    assetBalances: AssetBalance[];
};
type Transaction = {
    hash: string;
    inputs: UTxO[];
    outputs: UTxO[];
};
type AssetAddress = {
    address: string;
    quantity: bigint;
};
type DefinitionBytes = {
    bytes: string | DatumParameterKey;
};
type DefinitionInt = {
    int: number | DatumParameterKey;
};
type DefinitionList = {
    list: DefinitionField[] | DefinitionList[];
};
type DefinitionField = DefinitionConstr | DefinitionBytes | DefinitionInt | DefinitionList | Function | DefinitionField[];
type DefinitionConstr = {
    constructor: number | DatumParameterKey;
    fields: DefinitionField[];
};
type WalletOptions = {
    addressType?: AddressType;
    accountIndex?: number;
};
type SpendUTxO = {
    utxo: UTxO;
    redeemer?: string;
    validator?: Script;
    signer?: string;
};
type PayToAddress = {
    address: string;
    addressType: AddressType;
    assetBalances: AssetBalance[];
    spendUtxos?: SpendUTxO[];
    datum?: string;
    isInlineDatum: boolean;
};
type SwapFee = {
    id: string;
    title: string;
    description: string;
    value: bigint;
    isReturned: boolean;
};
type SwapInAmountMapping = {
    swapInAmount: bigint;
    liquidityPool: LiquidityPool;
};
type SwapOutAmountMapping = {
    swapOutAmount: bigint;
    liquidityPool: LiquidityPool;
};
type SplitCancelSwapMapping = {
    txHash: string;
    dex: string;
};
type DexTransactionError = {
    step: TransactionStatus;
    reason: string;
    reasonRaw: string;
};
type AssetMetadata = {
    policyId: string;
    nameHex: string;
    decimals: number;
};
type Cip30Api = {
    getNetworkId(): Promise<number>;
    getUtxos(): Promise<string[] | undefined>;
    getBalance(): Promise<string>;
    getUsedAddresses(): Promise<string[]>;
    getUnusedAddresses(): Promise<string[]>;
    getChangeAddress(): Promise<string>;
    getRewardAddresses(): Promise<string[]>;
    signTx(tx: string, partialSign: boolean): Promise<string>;
    signData(address: string, payload: string): Promise<{
        signature: string;
        key: string;
    }>;
    submitTx(tx: string): Promise<string>;
    getCollateral(): Promise<string[]>;
    experimental: {
        getCollateral(): Promise<string[]>;
        on(eventName: string, callback: (...args: unknown[]) => void): void;
        off(eventName: string, callback: (...args: unknown[]) => void): void;
    };
};
type DatumJson = {
    int?: number;
    bytes?: string;
    list?: Array<DatumJson>;
    map?: Array<{
        k: unknown;
        v: unknown;
    }>;
    fields?: Array<DatumJson>;
    [constructor: string]: unknown;
};

declare const lucidUtils: Utils;
declare function tokensMatch(tokenA: Token, tokenB: Token): boolean;
declare function correspondingReserves(liquidityPool: LiquidityPool, token: Token): bigint[];
declare function appendSlash(value?: string): string | undefined;
/**
 * Modified version from lucid
 */
declare function datumJsonToCbor(json: DatumJson): Datum;
declare function determineAddressType(address: string): AddressType;
declare const bytesToHex: (bytes: Uint8Array) => string;
declare const hexToBytes: (hex: string) => Uint8Array;

declare class DefinitionBuilder {
    private _definition;
    /**
     * Load a DEX definition file as a template for this builder.
     */
    loadDefinition(definition: DefinitionConstr): Promise<DefinitionBuilder>;
    /**
     * Push specified parameters to the definition template.
     */
    pushParameters(parameters: DatumParameters): DefinitionBuilder;
    /**
     * Pull parameters of a datum using a definition template.
     */
    pullParameters(definedDefinition: DefinitionConstr): DatumParameters;
    /**
     * Retrieve the CBOR for the builder.
     */
    getCbor(): string;
    /**
     * Recursively set specified parameters.
     */
    private applyParameters;
    /**
     * Recursively pull parameters from datum using definition template.
     */
    private extractParameters;
}

declare class MockWalletProvider extends BaseWalletProvider {
    isWalletLoaded: boolean;
    private _usableAddress;
    private _paymentCredential;
    private _stakingCredential;
    constructor();
    address(): string;
    publicKeyHash(): string;
    stakingKeyHash(): string;
    loadWallet(walletApi: Cip30Api): Promise<BaseWalletProvider>;
    loadWalletFromSeedPhrase(seed: string[], options?: WalletOptions): Promise<BaseWalletProvider>;
    createTransaction(): DexTransaction;
    attachMetadata(transaction: DexTransaction, key: number, json: Object): DexTransaction;
    paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;
    signTransaction(transaction: DexTransaction): Promise<DexTransaction>;
    submitTransaction(transaction: DexTransaction): Promise<string>;
}

declare class LucidProvider extends BaseWalletProvider {
    isWalletLoaded: boolean;
    private _api;
    private _usableAddress;
    private _paymentCredential;
    private _stakingCredential;
    private _network;
    address(): string;
    publicKeyHash(): string;
    stakingKeyHash(): string;
    loadWallet(walletApi: Cip30Api, config: BlockfrostConfig | KupmiosConfig): Promise<BaseWalletProvider>;
    loadWalletFromSeedPhrase(seed: string[], options: WalletOptions | undefined, config: BlockfrostConfig | KupmiosConfig): Promise<BaseWalletProvider>;
    createTransaction(): DexTransaction;
    attachMetadata(transaction: DexTransaction, key: number, json: Object): DexTransaction;
    paymentsForTransaction(transaction: DexTransaction, payToAddresses: PayToAddress[]): Promise<DexTransaction>;
    signTransaction(transaction: DexTransaction): Promise<DexTransaction>;
    submitTransaction(transaction: DexTransaction): Promise<string>;
    setNetwork(network: Network): void;
    private paymentFromAssets;
    private loadWalletInformation;
    private loadLucid;
}

declare class BlockfrostProvider extends BaseDataProvider {
    private _api;
    private _requestConfig;
    private _limiter;
    /**
     * https://docs.blockfrost.io/
     */
    constructor(config: BlockfrostConfig, requestConfig?: RequestConfig);
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos/get
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos~1%7Basset%7D/get
     */
    utxos(address: string, asset?: Asset): Promise<UTxO[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Transactions/paths/~1txs~1%7Bhash%7D~1utxos/get
     */
    transactionUtxos(txHash: string): Promise<UTxO[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    assetTransactions(asset: Asset): Promise<Transaction[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    assetAddresses(asset: Asset): Promise<AssetAddress[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Scripts/paths/~1scripts~1datum~1%7Bdatum_hash%7D/get
     */
    datumValue(datumHash: string): Promise<DefinitionField>;
    /**
     * https://docs.blockfrost.io/#section/Concepts
     */
    private sendPaginatedRequest;
}

declare class KupoProvider extends BaseDataProvider {
    private _config;
    private _kupoApi;
    private _requestConfig;
    constructor(config: KupoConfig, requestConfig?: RequestConfig);
    utxos(address: string, asset?: Asset): Promise<UTxO[]>;
    transactionUtxos(txHash: string): Promise<UTxO[]>;
    datumValue(datumHash: string): Promise<DefinitionField>;
    assetTransactions(asset: Asset): Promise<Transaction[]>;
    assetAddresses(asset: Asset): Promise<AssetAddress[]>;
    private toUtxos;
    private toDefinitionDatum;
}

declare class Minswap extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly marketOrderAddress: string;
    readonly limitOrderAddress: string;
    readonly cancelDatum: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}

declare class MinswapV2 extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly orderScriptHash: string;
    readonly cancelDatum: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}

declare class SundaeSwap extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly orderAddress: string;
    readonly cancelDatum: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}

declare class SundaeSwapV3 extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly cancelDatum: string;
    readonly orderScriptHash: string;
    readonly orderScript: Script;
    private readonly protocolFeeDefault;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}

declare class MuesliSwap extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly orderAddress: string;
    readonly cancelDatum: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}

/**
 * WingRiders constants.
 */
declare class WingRiders extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly orderAddress: string;
    readonly cancelDatum: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}

declare class WingRidersV2 extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly orderAddress: string;
    readonly cancelDatum: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}

declare class Splash extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly cancelDatum: string;
    readonly orderScriptHash: string;
    readonly batcherKey: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
    private getBeacon;
}

export { AddressType, type AssetAddress, type AssetBalance, type AssetMetadata, type AvailableDexs, BaseDex, BaseWalletProvider, type BlockfrostConfig, BlockfrostProvider, CancelSwapRequest, type Cip30Api, type DatumJson, DatumParameterKey, type DatumParameters, DefinitionBuilder, type DefinitionBytes, type DefinitionConstr, type DefinitionField, type DefinitionInt, type DefinitionList, DexTransaction, type DexTransactionError, Dexter, type DexterConfig, type KupmiosConfig, type KupoConfig, KupoProvider, LucidProvider, MetadataKey, Minswap, MinswapV2, MockWalletProvider, MuesliSwap, type PayToAddress, type RequestConfig, type SpendUTxO, Splash, type SplitCancelSwapMapping, SplitCancelSwapRequest, SplitSwapRequest, SundaeSwap, SundaeSwapV3, type SwapFee, type SwapInAmountMapping, type SwapOutAmountMapping, SwapRequest, type Transaction, TransactionStatus, type UTxO, type WalletOptions, WingRiders, WingRidersV2, appendSlash, bytesToHex, correspondingReserves, datumJsonToCbor, determineAddressType, hexToBytes, lucidUtils, tokensMatch };
