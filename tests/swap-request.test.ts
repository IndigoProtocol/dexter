import { Asset, Dexter, LiquidityPool, MockDataProvider, MockWalletProvider, SwapRequest, WingRiders, DexTransaction } from '../src';

describe('SwapRequest', () => {

    const dexter: Dexter = new Dexter({}, new MockDataProvider(), new MockWalletProvider());
    const swapRequest: SwapRequest = dexter.newSwapRequest();
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);
    const liquidityPool: LiquidityPool = new LiquidityPool(
        WingRiders.name,
        'addr1',
        'lovelace',
        asset,
        1000000n,
        1000000n,
    );

    describe('Parameter setting', () => {

        it('Can set liquidity pool', () => {
            swapRequest.forLiquidityPool(liquidityPool);

            expect(swapRequest.liquidityPool.uuid).toBe(liquidityPool.uuid);
        });

        it('Can set swap tokens', () => {
            swapRequest.forLiquidityPool(liquidityPool)
                .withSwapInToken('lovelace');

            expect(swapRequest.swapInToken).toBe('lovelace');
            expect((swapRequest.swapOutToken as Asset).id()).toBe(asset.id());
        });

        it('Fails on invalid swap in token', () => {
            swapRequest.forLiquidityPool(liquidityPool);

            expect(() => { swapRequest.withSwapInToken(new Asset('test1', 'test2')); }).toThrowError();
        });

        it('Can flip swap tokens', () => {
            swapRequest.forLiquidityPool(liquidityPool)
                .withSwapInToken('lovelace')
                .flip();

            expect((swapRequest.swapInToken as Asset).id()).toBe(asset.id());
            expect(swapRequest.swapOutToken).toBe('lovelace');
        });

        it('Can set swap in amount', () => {
            swapRequest.forLiquidityPool(liquidityPool)
                .withSwapInToken('lovelace')
                .withSwapInAmount(100n);

            expect(swapRequest.swapInAmount).toBe(100n);
        });

        it('Fails on incorrect swap in amount', () => {
            swapRequest.forLiquidityPool(liquidityPool)
                .withSwapInToken('lovelace');

            expect(() => { swapRequest.withSwapInAmount(-1n); }).toThrowError();
        });

        it('Can set slippage percent', () => {
            swapRequest.forLiquidityPool(liquidityPool)
                .withSlippagePercent(5.0);

            expect(swapRequest.slippagePercent).toBe(5.0);
        });

        it('Fails on incorrect slippage percent', () => {
            swapRequest.forLiquidityPool(liquidityPool);

            expect(() => { swapRequest.withSlippagePercent(-5.0); }).toThrowError();
        });

    });

});