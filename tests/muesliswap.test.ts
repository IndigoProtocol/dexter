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
    AddressType,
    UTxO
} from '../src';

describe('MuesliSwap', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);

    describe('Set Swap In', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            MuesliSwap.identifier,
            'lovelace',
            asset,
            1386837721743n,
            485925n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
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
                    expect(() => { muesliswap.buildSwapOrder(liquidityPool, defaultSwapParameters); }).not.toThrowError();
                    expect(payments[0].addressType).toBe(AddressType.Contract);
                    expect(payments[0].assetBalances[0].quantity).toEqual(100002650000n);
                    expect(payments[0].datum).toBe('d8799fd8799fd8799fd8799f42ed56ffd8799fd8799fd8799f42bac6ffffffff581cf66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b6988044695553444040197b98d87a801a00286f90ffff');
                });
        });

    });

    describe('Set Swap Out', () => {
        const liquidityPool: LiquidityPool = new LiquidityPool(
            MuesliSwap.identifier,
            'lovelace',
            asset,
            67011967873n,
            5026969972n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapOutAmount(10_000000n)
            .withSlippagePercent(0.5);

        it('Can calculate swap parameters', () => {
            expect(swapRequest.swapInAmount).toEqual(133971309n);
        });

    });

    describe('Muesliswap Cancel Order', () => {
        let muesliswap: MuesliSwap;
        const returnAddress = 'mockBlockchainAddress123';

        beforeEach(() => {
            muesliswap = new MuesliSwap();
        });

        it('should successfully cancel an order', async () => {
            let orderAddress = muesliswap.orderAddress;
            const txOutputs: UTxO[] = [
                {
                    txHash: 'mockTxHash123',
                    address: orderAddress,
                    datumHash: 'mockDatumHash123',
                    outputIndex: 0,
                    assetBalances: [{ asset: 'lovelace', quantity: 10000n }]
                }
            ];

            const result = await muesliswap.buildCancelSwapOrder(txOutputs, returnAddress);

            expect(result).toBeDefined();
            expect(result[0].address).toBe(returnAddress);
        });

        it('should fail to cancel an order with invalid UTxO', async () => {
            const invalidTxOutputs: UTxO[] = [
                {
                    txHash: 'invalidTxHash',
                    address: 'invalidAddress',
                    datumHash: 'invalidDatumHash',
                    outputIndex: 0,
                    assetBalances: [{ asset: 'lovelace', quantity: 10000n }]
                }
            ];

            try {
                await muesliswap.buildCancelSwapOrder(invalidTxOutputs, returnAddress);
                fail('Expected buildCancelSwapOrder to throw an error');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).toContain('Unable to find relevant UTxO for cancelling the swap order.');
                }
            }
        });

    });

});
