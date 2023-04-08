import { Dexter } from '../src/dexter';
import { Minswap } from '../src/dex/minswap';
import { Mock } from '../src/provider/mock';
import { DexterResponse } from '../src/types/global';
import { Blockfrost } from '../src/provider/blockfrost';
import { LiquidityPool } from '../src/dex/models/liquidity-pool';
import { Asset } from '../src/dex/models/asset';

describe('Dexter', () => {

    test.only('demo', async () => {
        await Dexter.new((new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', 'mainnetph527L8KoiutfNx9ls98lgn1G3IiLhbK')))
            .for(Minswap.name)
            .liquidityPools(new Asset('1a71dc14baa0b4fcfb34464adc6656d0e562571e2ac1bc990c9ce5f6', '574f4c46')).then((lps: DexterResponse) => {
                lps['Minswap'].forEach((lp: LiquidityPool) => {
                    console.log(lp.name)
                })

            expect(3).toEqual(3);
            })
        // (new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', 'mainnetph527L8KoiutfNx9ls98lgn1G3IiLhbK'))
        //     .utxos('addr1z8snz7c4974vzdpxu65ruphl3zjdvtxw8strf2c2tmqnxz2j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq0xmsha')
        //     .then((utxos) => {
        //         console.log(utxos.length)
        //     })
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
            .liquidityPoolsForPair('lovelace', 'lovelace')
            .then((response: DexterResponse) => {
                expect(response[Minswap.name]).toBeDefined();
                expect(response[Minswap.name].length).toStrictEqual(1);
            });
    });

});