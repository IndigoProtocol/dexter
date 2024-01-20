import {
    AddressType,
    Asset,
    DatumParameterKey,
    DatumParameters,
    Dexter,
    LiquidityPool,
    MockDataProvider,
    MockWalletProvider,
    PayToAddress,
    SwapRequest,
    UTxO,
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
            VyFinance.identifier,
            'lovelace',
            asset,
            519219742499n,
            39619096012n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;
        liquidityPool.marketOrderAddress = 'addr1testorder';

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
                [DatumParameterKey.SwapOutTokenAssetName]: asset.nameHex,
            };

            return vyfi.buildSwapOrder(liquidityPool, defaultSwapParameters)
                .then((payments: PayToAddress[]) => {
                    expect(() => { vyfi.buildSwapOrder(liquidityPool, defaultSwapParameters); }).not.toThrowError();
                    expect(payments[0].addressType).toBe(AddressType.Contract);
                    expect(payments[0].assetBalances[0].quantity).toBe(100_003_900000n);
                    expect(payments[0].datum).toBe('d8799f44ed56bac6d87c9f1b000000017a830584ffff');
                });
        });

    });

    describe('Set Swap Out', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            VyFinance.identifier,
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

    describe('VyFinance Cancel Order', () => {
        let vyFinance: VyFinance;
        const returnAddress = 'addr1';
        beforeEach(() => {
            vyFinance = new VyFinance();
            vyFinance.api.liquidityPools = async () => {
                const liquidityPool = new LiquidityPool(
                    VyFinance.identifier,
                    'lovelace',
                    new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344'),
                    519219742499n,
                    39619096012n,
                    'mockPoolAddress',
                    'mockMarketOrderAddress',
                    'mockLimitOrderAddress',
                );
                liquidityPool.extra = {
                    nft: {
                        policyId: 'mockNftPolicyId'
                    }
                };

                return [liquidityPool];
            };
        });

        it('should successfully cancel an order', async () => {
            const MockUTxO: UTxO[] = [{
                txHash: 'mockTxHash',
                address: 'mockMarketOrderAddress',
                datumHash: 'mockDatumHash',
                outputIndex: 0,
                assetBalances: [{asset: 'lovelace', quantity: 1000000000000n}]
            }];

            const cancelOrder = await vyFinance.buildCancelSwapOrder(MockUTxO, returnAddress);
            expect(cancelOrder).toBeDefined();
            expect(cancelOrder[0].address).toBe('addr1');
            expect(cancelOrder[0].assetBalances[0].quantity).toBe(1000000000000n);
        });

        it('should fail to cancel an order when the liquidity pool is not found', async () => {
            const mockUTxO: UTxO[] = [{
                txHash: 'mockTxHash',
                address: 'mockAddress',
                datumHash: 'mockDatumHash',
                outputIndex: 0,
                assetBalances: [{asset: 'lovelace', quantity: 1000000000000n}]
            }];

            try {
                await vyFinance.buildCancelSwapOrder(mockUTxO, returnAddress);
                fail('Expected buildCancelSwapOrder to throw an error');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).toContain('Unable to find relevant liquidity pool for cancelling the swap order.');
                }
            }

        });

        it('should fail to cancel an order with invalid UTxO', async () => {
            const invalidTxOutputs: UTxO[] = [
                {
                    txHash: 'invalidTxHash',
                    address: 'invalidAddress',
                    datumHash: 'invalidDatumHash',
                    outputIndex: 0,
                    assetBalances: [{ asset: 'lovelace', quantity: 1000000000000n }]
                }
            ];

            try {
                await vyFinance.buildCancelSwapOrder(invalidTxOutputs, returnAddress);
                fail('Expected buildCancelSwapOrder to throw an error');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).toContain('Unable to find relevant UTxO for cancelling the swap order.');
                }
            }

        });

    });

});
