import {
    Asset,
    Dexter,
    LiquidityPool,
    MockDataProvider,
    SwapRequest,
    MockWalletProvider,
    DatumParameters,
    DatumParameterKey,
    PayToAddress,
    AddressType,
    TeddySwap, UTxO,
} from '../src';

describe('TeddySwap', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);

    describe('Set Swap In', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            TeddySwap.identifier,
            'lovelace',
            asset,
            15853604203n,
            2999947840n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;
        liquidityPool.lpToken = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344');
        liquidityPool.poolNft = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344');

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(10_000_000000n)
            .withSlippagePercent(1.0);

        it('Can calculate swap parameters', () => {
            expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(38.68);
            expect(swapRequest.getEstimatedReceive()).toEqual(1158222522n);
            expect(swapRequest.getMinimumReceive()).toEqual(1146754972n);
        });

        it('Can build swap order', () => {
            const teddyswap: TeddySwap = new TeddySwap();
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
                [DatumParameterKey.SwapOutTokenAssetName]: asset.nameHex,
            };

            return teddyswap.buildSwapOrder(liquidityPool, defaultSwapParameters)
                .then((payments: PayToAddress[]) => {
                    expect(() => { teddyswap.buildSwapOrder(liquidityPool, defaultSwapParameters); }).not.toThrowError();
                    expect(payments[0].addressType).toBe(AddressType.Contract);
                    expect(payments[0].assetBalances[0].quantity).toEqual(10003800000n);
                    expect(payments[0].datum).toBe('d8799fd8799f4040ffd8799f581cf66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b698804469555344ffd8799f581cf66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b698804469555344ff1903e51b0037c3da31e5553c1b00038d7ea4c6800042ed56d8799f42bac6ff1b00000002540be4001a445a179cff');
                });
        });

    });

    describe('Set Swap Out', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            TeddySwap.identifier,
            'lovelace',
            asset,
            15853604203n,
            2999947840n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapOutAmount(1_000_000000n)
            .withSlippagePercent(1.0);

        it('Can calculate swap parameters', () => {
            expect(swapRequest.swapInAmount).toEqual(7950789864n);
        });

    });

    describe('Teddyswap Cancel Order', () => {
        let teddyswap: TeddySwap;
        const returnAddress = 'addr1';
        beforeEach(() => {
            teddyswap = new TeddySwap();
        });

        it('should successfully cancel an order', async () => {
            let marketOrderAddress = teddyswap.orderAddress;
            const txOutputs: UTxO[] = [
                {
                    txHash: 'mockTxHash123',
                    address: marketOrderAddress,
                    datumHash: 'mockDatumHash123',
                    outputIndex: 0,
                    assetBalances: [{ asset: 'lovelace', quantity: 1000000000000n }]
                }
            ];

            const result = await teddyswap.buildCancelSwapOrder(txOutputs, returnAddress);

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
                    assetBalances: [{ asset: 'lovelace', quantity: 1000000000000n }]
                }
            ];
            try {
                await teddyswap.buildCancelSwapOrder(invalidTxOutputs, returnAddress);
                fail('Expected buildCancelSwapOrder to throw an error');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    expect(error.message).toContain('Unable to find relevant UTxO for cancelling the swap order.');
                }
            }

        });


    });

});
