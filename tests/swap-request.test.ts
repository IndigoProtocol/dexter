import {
    Asset,
    Dexter,
    LiquidityPool,
    MockDataProvider,
    MockWalletProvider,
    SwapRequest,
    WingRiders,
    Minswap
} from '../src';

describe('SwapRequest', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);

    describe('Parameter setting', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            WingRiders.identifier,
            'lovelace',
            asset,
            1_000000n,
            1_000000n,
            'addr1',
        );
        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool);

        it('Can set liquidity pool', () => {
            expect(swapRequest.liquidityPool.uuid).toBe(liquidityPool.uuid);
        });

        it('Can set swap tokens', () => {
            swapRequest.withSwapInToken('lovelace');

            expect(swapRequest.swapInToken).toBe('lovelace');
            expect((swapRequest.swapOutToken as Asset).identifier()).toBe(asset.identifier());
        });

        it('Fails on invalid swap in token', () => {
            expect(() => { swapRequest.withSwapInToken(new Asset('test1', 'test2')); }).toThrowError();
        });

        it('Can flip swap tokens', () => {
            swapRequest.withSwapInToken('lovelace')
                .flip();

            expect((swapRequest.swapInToken as Asset).identifier()).toBe(asset.identifier());
            expect(swapRequest.swapOutToken).toBe('lovelace');
        });

        it('Can set swap in amount', () => {
            swapRequest.withSwapInToken('lovelace')
                .withSwapInAmount(100n);

            expect(swapRequest.swapInAmount).toBe(100n);
        });

        it('Fails on incorrect swap in amount', () => {
            swapRequest.withSwapInToken('lovelace');
            swapRequest.withSwapInAmount(-1n)

            expect(swapRequest.swapInAmount).toBe(0n);
        });

        it('Can set slippage percent', () => {
            swapRequest.withSlippagePercent(5.0);

            expect(swapRequest.slippagePercent).toBe(5.0);
        });

        it('Fails on incorrect slippage percent', () => {
            expect(() => { swapRequest.withSlippagePercent(-5.0); }).toThrowError();
        });

    });

    describe('Alter Order', () => {

        const liquidityPool: LiquidityPool = new LiquidityPool(
            Minswap.identifier,
            'lovelace',
            asset,
            30817255371488n,
            349805856622734n,
            'addr1',
        );
        liquidityPool.poolFeePercent = 0.3;

        const swapRequest: SwapRequest = dexter.newSwapRequest()
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(10_000_000_000000n)
            .withSlippagePercent(0.5);

        it('Can flip swap in & swap out amounts', () => {
            swapRequest.flip();

            expect(swapRequest.swapOutToken).toBe('lovelace');
            expect(swapRequest.swapInAmount).toBe(168542118380811n);
            expect(swapRequest.getEstimatedReceive()).toBe(10_000_000_000000n);
        });

    });

});
