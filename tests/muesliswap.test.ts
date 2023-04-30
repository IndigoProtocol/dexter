import { Asset, Dexter, LiquidityPool, MuesliSwap, MockDataProvider, SwapRequest } from '../src';

describe('MuesliSwap', () => {

    it('Can calculate swap parameters', () => {
        const dexter: Dexter = new Dexter(new MockDataProvider());
        const swapRequest: SwapRequest = dexter.newSwapRequest();
        const liquidityPool: LiquidityPool = new LiquidityPool(
            MuesliSwap.name,
            'addr1',
            'lovelace',
            new Asset('', '', 6),
            1386837721743n,
            485925n,
        );
        liquidityPool.poolFee = 0.3;

        swapRequest
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(100_000_000000n)
            .withSlippagePercent(3.0);

        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(7.51);
        expect(swapRequest.getEstimatedReceive()).toEqual(32590n);
        expect(swapRequest.getMinimumReceive()).toEqual(31640n);
    });

});