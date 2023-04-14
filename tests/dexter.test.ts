import { Dexter } from '../src/dexter';
import { Minswap } from '../src/dex/minswap';
import { Mock } from '../src/provider/mock';
import { DexterConfig, DexterResponse } from '../src/types/global';
import { Blockfrost } from '../src/provider/blockfrost';
import { Asset } from '../src/dex/models/asset';
import { LiquidityPool } from '../src/dex/models/liquidity-pool';

describe('Dexter', () => {

    test.only('demo', async () => {
        const d = new Dexter(new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', 'mainnetph527L8KoiutfNx9ls98lgn1G3IiLhbK'));

        const lp: LiquidityPool = new LiquidityPool(
            Minswap.name,
            'addr1z8snz7c4974vzdpxu65ruphl3zjdvtxw8strf2c2tmqnxz2j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq0xmsha',
            new Asset('e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86', '620719c204a0338059aad43b35332b9353216c719901c8ca9f726ae4ec313da5', 8),
            0n,
            new Asset('f43a62fdc3965df486de8a0d32fe800963589c41b38946602a0dc535', '41474958', 8),
            'lovelace',
            0n,
            0n
            )

        d.newRequest().getLiquidityPoolHistory(lp).then(() => {

        })

            // d
            // .newRequest()
            // .for(Minswap.name)
            // .getLiquidityPools(new Asset('f43a62fdc3965df486de8a0d32fe800963589c41b38946602a0dc535', '41474958', 8), 'lovelace').then((lps: DexterResponse) => {
            //     // d.newRequest().getLiquidityPoolHistory(lps['Minswap'][0]).then(() => {
            //     //
            //     // })
            //     console.log(lps['Minswap'][0])
            // })
    });

    // test('can add on DEX', () => {
    //     let dexter = Dexter.new(new Mock())
    //         .for(Minswap.name);
    //
    //     expect(dexter.onDexs[0]).toBeInstanceOf(Minswap);
    // });
    //
    // test('can reset on DEXs', () => {
    //     let dexter = Dexter.new(new Mock())
    //         .for(Minswap.name)
    //         .reset();
    //
    //     expect(dexter.onDexs).toStrictEqual([]);
    // });
    //
    // test('can pull a liquidity pool', () => {
    //     Dexter.new(new Mock())
    //         .for(Minswap.name)
    //         .liquidityPools('lovelace', 'lovelace')
    //         .then((response: DexterResponse) => {
    //             expect(response[Minswap.name]).toBeDefined();
    //             expect(response[Minswap.name].length).toStrictEqual(1);
    //         });
    // });

});