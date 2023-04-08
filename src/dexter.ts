import { LiquidityPool } from './dex/models/liquidity-pool';
import { BaseDex } from './dex/base-dex';
import { Minswap } from './dex/minswap';
import { BaseProvider } from './provider/base-provider';
import { DexterResponse } from './types/global';
import { Token } from './dex/models/asset';

export class Dexter {

    provider: BaseProvider;
    onDexs: BaseDex[] = [];
    availableDexes: { [key: string]: BaseDex };

    static new(provider: BaseProvider): Dexter {
        let dexter = new this();

        dexter.withProvider(provider);
        dexter.availableDexes = {
            [Minswap.name]: new Minswap(),
        };

        return dexter;
    }

    withProvider(provider: BaseProvider): Dexter {
        this.provider = provider;

        return this;
    }

    for(dexs: string | string[]): Dexter {
        (Array.isArray(dexs) ? dexs : [dexs]).forEach((dexName: string) => {
            if (! Object.keys(this.availableDexes).includes(dexName)) {
                throw new Error(`DEX ${dexName} is not available.`);
            }

            this.onDexs = this.onDexs.filter((dex: BaseDex) => {
                return dex.name !== dexName;
            }).concat(this.availableDexes[dexName]);
        });

        return this;
    }

    forAll(): Dexter {
        this.onDexs = Object.values(this.availableDexes);

        return this;
    }

    reset(): Dexter {
        this.onDexs = [];

        return this;
    }

    liquidityPools(assetA: Token, assetB?: Token): Promise<DexterResponse> {
        return Promise.all(
            this.onDexs.map((dex: BaseDex) => dex.liquidityPools(this.provider, assetA, assetB)),
        ).then((mappedLiquidityPools: Awaited<LiquidityPool[]>[]) => {
            return mappedLiquidityPools.flat().reduce((result: DexterResponse, liquidityPool?: LiquidityPool) => {
                if (! liquidityPool) {
                    return result;
                }

                (result[liquidityPool.dex] = result[liquidityPool.dex] || []).push(liquidityPool);

                return result;
            }, {} as DexterResponse);
        });
    }

}