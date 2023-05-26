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
    const dexter: Dexter = new Dexter({}, new MockDataProvider(), walletProvider);
    const swapRequest: SwapRequest = dexter.newSwapRequest();
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);
    const liquidityPool: LiquidityPool = new LiquidityPool(
        VyFinance.name,
        'addr1',
        'lovelace',
        asset,
        38670441543n,
        5455789926n,
    );
    liquidityPool.poolFeePercent = 0.3;

    swapRequest
        .forLiquidityPool(liquidityPool)
        .withSwapInToken('lovelace')
        .withSwapInAmount(100_000_000000n)
        .withSlippagePercent(0.5);

    it('Can calculate swap parameters', () => {
        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(72.05);
        expect(swapRequest.getEstimatedReceive()).toEqual(3_931_058177n);
        expect(swapRequest.getMinimumReceive()).toEqual(3_911_500673n);
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

        return vyfi.buildSwapOrder(defaultSwapParameters)
            .then((payments: PayToAddress[]) => {
                expect(payments[0].addressType).toBe(AddressType.Contract);
                expect(payments[0].assetBalances[0].quantity).toBe(100_003_900000n);
                expect(payments[0].datum).toBe('d8799f42ed56d87c9f1ae924c381ffff');
            });
    });

});