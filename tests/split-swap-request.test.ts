import {
    Asset,
    Dexter,
    LiquidityPool,
    MockDataProvider,
    MockWalletProvider,
    WingRiders,
    Minswap
} from '../src';
import { SplitSwapRequest } from '../src/requests/split-swap-request';

describe('SplitSwapRequest', () => {

    const walletProvider: MockWalletProvider = new MockWalletProvider();
    walletProvider.loadWalletFromSeedPhrase(['']);
    const dexter: Dexter = (new Dexter())
        .withDataProvider(new MockDataProvider())
        .withWalletProvider(walletProvider);
    const asset: Asset = new Asset('f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880', '69555344', 6);

    const minswapPool: LiquidityPool = new LiquidityPool(
        Minswap.identifier,
        'lovelace',
        asset,
        30817255371488n,
        349805856622734n,
        'addr1',
    );
    minswapPool.poolFeePercent = 0.3

    const wingridersPool: LiquidityPool = new LiquidityPool(
        WingRiders.identifier,
        'lovelace',
        asset,
        923224398616n,
        7942169n,
        'addr1',
    );
    wingridersPool.poolFeePercent = 0.35;

    describe('Parameter setting', () => {

        const swapRequest: SplitSwapRequest = dexter.newSplitSwapRequest();

        it('Can set swap in token', () => {
            swapRequest.withSwapInToken('lovelace')

            expect(swapRequest.swapInToken).toBe('lovelace');
        });

        it('Can set swap out token', () => {
            swapRequest.withSwapOutToken('lovelace')

            expect(swapRequest.swapOutToken).toBe('lovelace');
        });

        it('Can set swap in mappings', () => {
            swapRequest.withSwapInAmountMappings([
                {
                    swapInAmount: 2_000000n,
                    liquidityPool: minswapPool,
                }
            ])

            expect(swapRequest.swapRequests[0].liquidityPool.uuid).toBe(minswapPool.uuid);
            expect(swapRequest.swapRequests[0].swapInAmount).toBe(2_000000n);
        });

        it('Can set swap out mappings', () => {
            swapRequest.withSwapOutAmountMappings([
                {
                    swapOutAmount: 2_000000n,
                    liquidityPool: minswapPool,
                }
            ])

            expect(swapRequest.swapRequests[0].liquidityPool.uuid).toBe(minswapPool.uuid);
        });

    })

    describe('Alter Order', () => {

        it('Can flip all swap in tokens', () => {
            const swapRequest: SplitSwapRequest = dexter.newSplitSwapRequest();

            swapRequest
                .withSwapInToken(asset)
                .withSwapInAmountMappings([
                    {
                        swapInAmount: 2_000000n,
                        liquidityPool: minswapPool,
                    },
                    {
                        swapInAmount: 2_000000n,
                        liquidityPool: wingridersPool,
                    }
                ])
                .flip();

            expect(swapRequest.swapRequests[0].swapInToken).toBe('lovelace');
            expect(swapRequest.swapRequests[1].swapInToken).toBe('lovelace');
        });

        it('Can calculate avg. price impact percent', () => {
            const swapRequest: SplitSwapRequest = dexter.newSplitSwapRequest();

            swapRequest
                .withSwapInToken('lovelace')
                .withSlippagePercent(0.5)
                .withSwapInAmountMappings([
                    {
                        swapInAmount: 10_000_000_000000n,
                        liquidityPool: minswapPool,
                    },
                    {
                        swapInAmount: 10_000_000000n,
                        liquidityPool: wingridersPool,
                    }
                ]);

            expect(+swapRequest.getAvgPriceImpactPercent().toFixed(2)).toEqual(12.90);
        });

    });

});
