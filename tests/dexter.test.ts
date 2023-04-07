import { Dexter } from '../src/dexter';
import { Minswap } from '../src/dex/minswap';
import { Mock } from '../src/provider/mock';
import { DexterResponse } from '../src/types/global';

describe('Dexter', () => {

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
            .liquidityPool('lovelace', 'lovelace')
            .then((response: DexterResponse) => {
                expect(response[Minswap.name]).toBeDefined();
                expect(response[Minswap.name].length).toStrictEqual(1);
            });
    });

});