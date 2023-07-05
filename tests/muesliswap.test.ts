import {
    Asset,
    Dexter,
    LiquidityPool,
    MuesliSwap,
    MockDataProvider,
    SwapRequest,
    MockWalletProvider,
    DatumParameters,
    DatumParameterKey,
    PayToAddress,
    AddressType
} from '../src';

describe('MuesliSwap', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const swapRequest: SwapRequest = dexter.newSwapRequest();
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);
    const liquidityPool: LiquidityPool = new LiquidityPool(
        MuesliSwap.name,
        'lovelace',
        asset,
        1386837721743n,
        485925n,
        'addr1',
    );
    liquidityPool.poolFeePercent = 0.3;

    swapRequest
        .forLiquidityPool(liquidityPool)
        .withSwapInToken('lovelace')
        .withSwapInAmount(100_000_000000n)
        .withSlippagePercent(3.0);

    it('Can calculate swap parameters', () => {
        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(7.51);
        expect(swapRequest.getEstimatedReceive()).toEqual(32590n);
        expect(swapRequest.getMinimumReceive()).toEqual(31640n);
    });

    it('Can build swap order', () => {
        const muesliswap: MuesliSwap = new MuesliSwap();
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

        return muesliswap.buildSwapOrder(liquidityPool, defaultSwapParameters)
            .then((payments: PayToAddress[]) => {
                expect(payments[0].addressType).toBe(AddressType.Contract);
                expect(payments[0].assetBalances[0].quantity).toEqual(100002650000n);
                expect(payments[0].datum).toBe('d8799fd8799fd8799fd8799f42ed56ffd8799fd8799fd8799f42bac6ffffffff581cf66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b6988044695553444040197b98d87a801a00286f90ffff');
            });
    });

});
