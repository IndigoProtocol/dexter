import { Dexter } from '../src/dexter';
import { Minswap } from '../src/dex/minswap';
import { Mock } from '../src/provider/mock';
import { DexterResponse } from '../src/types/global';
import { Blockfrost } from '../src/provider/blockfrost';
import { LiquidityPool } from '../src/dex/models/liquidity-pool';
import { Asset } from '../src/dex/models/asset';

describe('Dexter', () => {

    test.only('demo', async () => {
        const d = await Dexter.new((new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', 'mainnetph527L8KoiutfNx9ls98lgn1G3IiLhbK')));

            d.for(Minswap.name)
            .liquidityPools(new Asset('f43a62fdc3965df486de8a0d32fe800963589c41b38946602a0dc535', '41474958', 8), 'lovelace').then((lps: DexterResponse) => {
                lps['Minswap'].forEach((lp) => {
                    console.log(lp.price)
                })
            })
    });

    test('can add on DEX', () => {
        let dexter = Dexter.new(new Mock())
            .for(Minswap.name);

        expect(dexter.onDexs[0]).toBeInstanceOf(Minswap);
    });

    test('can reset on DEXs', () => {
        let dexter = Dexter.new(new Mock())
            .for(Minswap.name)
            .reset();

        expect(dexter.onDexs).toStrictEqual([]);
    });

    test('can pull a liquidity pool', () => {
        Dexter.new(new Mock())
            .for(Minswap.name)
            .liquidityPools('lovelace', 'lovelace')
            .then((response: DexterResponse) => {
                expect(response[Minswap.name]).toBeDefined();
                expect(response[Minswap.name].length).toStrictEqual(1);
            });
    });

});