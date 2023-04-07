import { LiquidityPool } from './dex/models/liquidity-pool';
import { BaseDex } from './dex/base-dex';
import { Asset } from './types/dex';
import { Minswap } from './dex/minswap';
import { BaseProvider } from './provider/base-provider';
import { DexterResponse } from './types/global';

export class Dexter {

    provider: BaseProvider;
    onDexs: BaseDex[] = [];
    availableDexes: { [key: string]: BaseDex };

    static new(provider: BaseProvider) {
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

    all(): Dexter {
        this.onDexs = Object.values(this.availableDexes);

        return this;
    }

    reset(): Dexter {
        this.onDexs = [];

        return this;
    }

    liquidityPool(assetA: Asset, assetB: Asset): Promise<DexterResponse> {
        return Promise.all(
            this.onDexs.map((dex: BaseDex) => dex.liquidityPool(assetA, assetB)),
        ).then((liquidityPools: LiquidityPool[]) => {
            return liquidityPools.reduce((result: DexterResponse, liquidityPool: LiquidityPool) => {
                (result[liquidityPool.dex] = result[liquidityPool.dex] || []).push(liquidityPool);

                return result;
            }, {} as DexterResponse);
        });
    }

    liquidityPools(asset: Asset): Promise<LiquidityPool[]> {
        return Promise.resolve([]);
    }

}