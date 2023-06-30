import {
    Asset,
    Dexter,
    LiquidityPool,
    SundaeSwap,
    MockDataProvider,
    SwapRequest,
    MockWalletProvider,
    DatumParameters,
    DatumParameterKey,
    PayToAddress,
    AddressType,
} from '../src';

describe('SundaeSwap', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);

    describe('Set Swap In', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            SundaeSwap.name,
            'lovelace',
            asset,
            3699642000000n,
            78391015000000n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;


        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(10_000_000000n)
            .withSlippagePercent(1.0);

        it('Can calculate swap parameters', () => {
            expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(0.27);
            expect(swapRequest.getEstimatedReceive()).toEqual(210_684_680649n);
            expect(swapRequest.getMinimumReceive()).toEqual(208_598_693711n);
        });

        it('Can build swap order', () => {
            const sundaeswap: SundaeSwap = new SundaeSwap();
            const defaultSwapParameters: DatumParameters = {
                [DatumParameterKey.PoolIdentifier]: '1234',
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

            return sundaeswap.buildSwapOrder(liquidityPool, defaultSwapParameters)
                .then((payments: PayToAddress[]) => {
                    expect(payments[0].addressType).toBe(AddressType.Contract);
                    expect(payments[0].assetBalances[0].quantity).toEqual(10004500000n);
                    expect(payments[0].datum).toBe('d8799f421234d8799fd8799fd8799fd8799f42ed56ffd8799fd8799fd8799f42bac6ffffffffd87a80ffd87a80ff1a002625a0d8799fd879801b00000002540be400d8799f1b000000309173774fffffff');
                });
        });

    });

    describe('Set Swap Out', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            SundaeSwap.name,
            'lovelace',
            asset,
            1032791394311n,
            74925313821n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapOutAmount(100_000000n)
            .withSlippagePercent(0.5);

        it('Can calculate swap parameters', () => {
            expect(swapRequest.swapInAmount).toEqual(1384410858n);
        });

    });

});
