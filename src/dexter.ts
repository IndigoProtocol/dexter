import { LiquidityPool } from './dex/models/liquidity-pool';
import { BaseDex } from './dex/base-dex';
import { Minswap } from './dex/minswap';
import { BaseProvider } from './provider/base-provider';
import { DexterResponse } from './types/global';
import { Token } from './dex/models/asset';
import { Transaction, UTxO } from './types/provider';

export class Dexter {

    provider: BaseProvider;
    onDexs: BaseDex[] = [];
    availableDexes: { [key: string]: BaseDex };
    shouldResolveAssetMetadata: boolean = false;

    static new(provider: BaseProvider): Dexter {
        let dexter = new this();

        dexter.withProvider(provider);
        dexter.availableDexes = {
            [Minswap.name]: new Minswap(),
        };

        return dexter;
    }

    /**
     * Switch to a new provider.
     */
    withProvider(provider: BaseProvider): Dexter {
        this.provider = provider;

        return this;
    }

    /**
     * Whether to resolve asset metadata for more accuracy when possible.
     */
    shouldResolveMetadata(): Dexter {
        this.shouldResolveAssetMetadata = true;

        return this;
    }

    /**
     * Set the DEX(s) Dexter will fetch data for.
     */
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

    /**
     * Fetch data for all available DEXs.
     */
    forAll(): Dexter {
        this.onDexs = Object.values(this.availableDexes);

        return this;
    }

    /**
     * Reset DEXs Dexter will grab data for.
     */
    reset(): Dexter {
        this.onDexs = [];
        this.shouldResolveAssetMetadata = false;

        return this;
    }

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     * All liquidity pools will be returned if assetA & assetB are not provided.
     */
    liquidityPools(assetA: Token = 'lovelace', assetB?: Token): Promise<DexterResponse> {
        return Promise.all(
            this.onDexs.map((dex: BaseDex) => dex.liquidityPools(this.provider, assetA, assetB)),
        ).then((mappedLiquidityPools: Awaited<LiquidityPool[]>[]) => {
            return mappedLiquidityPools.flat().reduce((result: DexterResponse, liquidityPool?: LiquidityPool) => {
                if (liquidityPool) {
                    (result[liquidityPool.dex] = result[liquidityPool.dex] || []).push(liquidityPool);
                }

                return result;
            }, {} as DexterResponse);
        });
    }

    /**
     * Fetch historic states for a liquidity pool.
     */
    async liquidityPoolHistory(liquidityPool: LiquidityPool): Promise<LiquidityPool[]> {
        const transactions: Transaction[] = await this.provider.assetTransactions(liquidityPool.lpToken.id());

        const liquidityPoolPromises: Promise<LiquidityPool>[] = transactions.map(async (transaction: Transaction) => {
            const utxos: UTxO[] = await this.provider.transactionUtxos(transaction.txHash);

            const relevantUtxo: UTxO = utxos.find((utxo: UTxO) => {
                return utxo.address === liquidityPool.address;
            });

            if (!relevantUtxo) {
                throw new Error('Unable to find UTxO for liquidity pool history');
            }

            return this.availableDexes[liquidityPool.dex].liquidityPoolFromUtxo(
                relevantUtxo,
                liquidityPool.assetA,
                liquidityPool.assetB
            );
        });

        return await Promise.all(liquidityPoolPromises);
    }

}