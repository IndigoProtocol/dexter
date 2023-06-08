import {
    Asset,
    Dexter,
    LiquidityPool,
    Minswap,
    MockDataProvider,
    SwapRequest,
    MockWalletProvider,
    DatumParameters,
    DatumParameterKey,
    PayToAddress,
    AddressType
} from '../src';

describe('Minswap', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const swapRequest: SwapRequest = dexter.newSwapRequest();
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);
    const liquidityPool: LiquidityPool = new LiquidityPool(
        Minswap.name,
        'lovelace',
        asset,
        30817255371488n,
        349805856622734n,
        'addr1',
    );
    liquidityPool.poolFeePercent = 0.3;

    swapRequest
        .forLiquidityPool(liquidityPool)
        .withSwapInToken('lovelace')
        .withSwapInAmount(10_000_000_000000n)
        .withSlippagePercent(0.5);

    it('Can calculate swap parameters', () => {
        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(24.37);
        expect(swapRequest.getEstimatedReceive()).toEqual(85_506_228_814959n);
        expect(swapRequest.getMinimumReceive()).toEqual(85_080_824_691501n);
    });

    it('Can build swap order', () => {
        const minswap: Minswap = new Minswap();
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

        return minswap.buildSwapOrder(liquidityPool, defaultSwapParameters)
            .then((payments: PayToAddress[]) => {
                expect(payments[0].addressType).toBe(AddressType.Contract);
                expect(payments[0].assetBalances[0].quantity).toEqual(10000004000000n);
                expect(payments[0].datum).toBe('d8799fd8799fd8799f42ed56ffd8799fd8799fd8799f42bac6ffffffffd8799fd8799f42ed56ffd8799fd8799fd8799f42bac6ffffffffd87a80d8799fd8799f581cf66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b698804469555344ff1b00004d616c553b2dff1a001e84801a001e8480ff');
            });
    });

});