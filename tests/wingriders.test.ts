import {
    Dexter,
    LiquidityPool,
    WingRiders,
    MockDataProvider,
    SwapRequest,
    Asset,
    MockWalletProvider,
    DatumParameters,
    DatumParameterKey,
    PayToAddress,
    AddressType
} from '../src';

describe('WingRiders', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const swapRequest: SwapRequest = dexter.newSwapRequest();
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);
    const liquidityPool: LiquidityPool = new LiquidityPool(
        WingRiders.name,
        'lovelace',
        asset,
        50491527399n,
        12677234723n,
        'addr1',
    );
    liquidityPool.poolFeePercent = 0.35;

    swapRequest
        .forLiquidityPool(liquidityPool)
        .withSwapInToken('lovelace')
        .withSwapInAmount(10_000000n)
        .withSlippagePercent(0.5);

    it('Can calculate swap parameters', () => {
        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(0.37);
        expect(swapRequest.getEstimatedReceive()).toEqual(2_501483n);
        expect(swapRequest.getMinimumReceive()).toEqual(2_489037n);
    });

    it('Can build swap order', () => {
        const wingriders: WingRiders = new WingRiders();
        const defaultSwapParameters: DatumParameters = {
            [DatumParameterKey.SenderPubKeyHash]: walletProvider.publicKeyHash(),
            [DatumParameterKey.SenderStakingKeyHash]: walletProvider.stakingKeyHash(),
            [DatumParameterKey.ReceiverPubKeyHash]: walletProvider.publicKeyHash(),
            [DatumParameterKey.ReceiverStakingKeyHash]: walletProvider.stakingKeyHash(),
            [DatumParameterKey.SwapInAmount]: swapRequest.swapInAmount,
            [DatumParameterKey.MinReceive]: swapRequest.getMinimumReceive(),
            [DatumParameterKey.SwapInTokenPolicyId]: '',
            [DatumParameterKey.SwapInTokenAssetName]: '',
            [DatumParameterKey.SwapOutTokenPolicyId]: asset.policyId,
            [DatumParameterKey.SwapOutTokenAssetName]: asset.assetNameHex,
        };

        return wingriders.buildSwapOrder(liquidityPool, defaultSwapParameters)
            .then((payments: PayToAddress[]) => {
                expect(payments[0].addressType).toBe(AddressType.Contract);
                expect(payments[0].assetBalances[0].quantity).toEqual(14000000n);
                // expect(payments[0].datum?.startsWith('d8799fd8799fd8799fd8799f42ed56ffd8799fd8799fd8799f42bac6ffffffff42ed561b00000187d5a')).toBe(true);
            });
    });

});