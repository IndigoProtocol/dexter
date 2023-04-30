import { Dexter, LiquidityPool, WingRiders, MockDataProvider, SwapRequest, Asset } from '../src';

describe('WingRiders', () => {

    it('Can calculate swap parameters', () => {
        const dexter: Dexter = new Dexter(new MockDataProvider());
        const swapRequest: SwapRequest = dexter.newSwapRequest();
        const liquidityPool: LiquidityPool = new LiquidityPool(
            WingRiders.name,
            'addr1',
            'lovelace',
            new Asset('', '', 6),
            50491527399n,
            12677234723n,
        );
        liquidityPool.poolFee = 0.35;

        swapRequest
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(10_000000n)
            .withSlippagePercent(0.5);

        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(0.37);
        expect(swapRequest.getEstimatedReceive()).toEqual(2_501483n);
        expect(swapRequest.getMinimumReceive()).toEqual(2_489037n);
    });

});