import {
    Dexter,
    LiquidityPool,
    MockDataProvider,
    SwapRequest,
    Asset,
    MockWalletProvider,
    DatumParameters,
    DatumParameterKey,
    PayToAddress,
    AddressType,
    VyFinance,
} from '../src';

describe('VyFinance', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);

    describe('Set Swap In', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            VyFinance.name,
            'lovelace',
            asset,
            519219742499n,
            39619096012n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;
        liquidityPool.extra.orderAddress = 'addr1testorder';

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(100_000_000000n)
            .withSlippagePercent(0.5);

        it('Can calculate swap parameters', () => {
            expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(16.11);
            expect(swapRequest.getEstimatedReceive()).toEqual(6382126148n);
            expect(swapRequest.getMinimumReceive()).toEqual(6350374276n);
        });

        it('Can build swap order', () => {
            const vyfi: VyFinance = new VyFinance();
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

            return vyfi.buildSwapOrder(liquidityPool, defaultSwapParameters)
                .then((payments: PayToAddress[]) => {
                    expect(payments[0].addressType).toBe(AddressType.Contract);
                    expect(payments[0].assetBalances[0].quantity).toBe(100_003_900000n);
                    expect(payments[0].datum).toBe('d8799f44ed56bac6d87c9f1b000000017a830584ffff');
                });
        });

    });

    describe('Set Swap Out', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            VyFinance.name,
            'lovelace',
            asset,
            519179782499n,
            39622139292n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapOutAmount(1_000_000000n)
            .withSlippagePercent(0.5);

        it('Can calculate swap parameters', () => {
            expect(swapRequest.swapInAmount).toEqual(13482992348n);
        });

    });

});
