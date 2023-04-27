import { Dexter, LiquidityPool, Minswap, Mock, SwapRequest, Asset } from '../src';
import { MuesliSwap, SundaeSwap, WingRiders } from '../build';

describe('SwapRequest', () => {

    const dexter: Dexter = new Dexter(new Mock());
    const swapRequest: SwapRequest = dexter.newSwapRequest();

    it('Can calculate Minswap swap parameters', () => {
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

    it('Can calculate WingRiders swap parameters', () => {
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

    it('Can calculate SundaeSwap swap parameters', () => {
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

    it('Can calculate MuesliSwap swap parameters', () => {
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