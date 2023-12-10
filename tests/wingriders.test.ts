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
    AddressType,
} from '../src';

describe('WingRiders', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);

    describe('Set Swap In', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            WingRiders.identifier,
            'lovelace',
            asset,
            923224398616n,
            7942169n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.35;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(10_000_000000n)
            .withSlippagePercent(0.5);

        it('Can calculate swap parameters', () => {
            expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(1.43);
            expect(swapRequest.getEstimatedReceive()).toEqual(84809n);
            expect(swapRequest.getMinimumReceive()).toEqual(84387n);
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
                [DatumParameterKey.SwapOutTokenAssetName]: asset.nameHex,
            };

            return wingriders.buildSwapOrder(liquidityPool, defaultSwapParameters)
                .then((payments: PayToAddress[]) => {
                    expect(() => { wingriders.buildSwapOrder(liquidityPool, defaultSwapParameters); }).not.toThrowError();
                    expect(payments[0].addressType).toBe(AddressType.Contract);
                    expect(payments[0].assetBalances[0].quantity).toEqual(10004000000n);
                });
        });

        it('Can calculate price impact with 0 decimals', () => {
            const hosky: Asset = new Asset('a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235', '484f534b59', 0);
            const hoskyPool: LiquidityPool = new LiquidityPool(
                WingRiders.identifier,
                'lovelace',
                hosky,
                52428070796n,
                1424861277563n,
                'addr1',
            );
            hoskyPool.poolFeePercent = 0.35;

            const swap: SwapRequest = dexter.newSwapRequest()
                .forLiquidityPool(hoskyPool)
                .withSwapInToken('lovelace')
                .withSwapInAmount(1_000_000000n)
                .withSlippagePercent(0.5);

            expect(+swap.getPriceImpactPercent().toFixed(2)).toEqual(2.23);
        });

    });

    describe('Set Swap Out', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            WingRiders.identifier,
            'lovelace',
            asset,
            925723148616n,
            7920796n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.35;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapOutAmount(1_000000n)
            .withSlippagePercent(0.5);

        it('Can calculate swap parameters', () => {
            expect(swapRequest.swapInAmount).toEqual(134229438286n);
        });

    });

});
