import { Asset, Dexter, LiquidityPool, Minswap, MockDataProvider, SwapRequest } from '../src';

describe('Minswap', () => {

    const dexter: Dexter = new Dexter(new MockDataProvider());
    const swapRequest: SwapRequest = dexter.newSwapRequest();

    it('Can calculate swap parameters', () => {
        const liquidityPool: LiquidityPool = new LiquidityPool(
            Minswap.name,
            'addr1',
            'lovelace',
            new Asset('', '', 6),
            30817255371488n,
            349805856622734n,
        );
        liquidityPool.poolFee = 0.3;

        swapRequest
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(10_000_000_000000n)
            .withSlippagePercent(0.5);

        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(24.37);
        expect(swapRequest.getEstimatedReceive()).toEqual(85_506_228_814959n);
        expect(swapRequest.getMinimumReceive()).toEqual(85_080_824_691501n);
    });

});