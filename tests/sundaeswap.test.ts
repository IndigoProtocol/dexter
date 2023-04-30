import { Asset, Dexter, LiquidityPool, SundaeSwap, MockDataProvider, SwapRequest } from '../src';

describe('SundaeSwap', () => {

    it('Can calculate swap parameters', () => {
        const dexter: Dexter = new Dexter(new MockDataProvider());
        const swapRequest: SwapRequest = dexter.newSwapRequest();
        const liquidityPool: LiquidityPool = new LiquidityPool(
            SundaeSwap.name,
            'addr1',
            'lovelace',
            new Asset('', '', 6),
            3699642000000n,
            78391015000000n,
        );
        liquidityPool.poolFee = 0.3;

        swapRequest
            .forLiquidityPool(liquidityPool)
            .withSwapInToken('lovelace')
            .withSwapInAmount(10_000_000000n)
            .withSlippagePercent(1.0);

        expect(+swapRequest.getPriceImpactPercent().toFixed(2)).toEqual(0.27);
        expect(swapRequest.getEstimatedReceive()).toEqual(210_684_680649n);
        expect(swapRequest.getMinimumReceive()).toEqual(208_598_693711n);
    });

});