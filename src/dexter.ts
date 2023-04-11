import { LiquidityPool } from './dex/models/liquidity-pool';
import { BaseDex } from './dex/base-dex';
import { Minswap } from './dex/minswap';
import { BaseProvider } from './provider/base-provider';
import { DexterConfig, DexterResponse } from './types/global';
import { Asset, Token } from './dex/models/asset';
import { Transaction, UTxO } from './types/provider';
import { TokenRegistry } from './services/token-registry';

export class Dexter {

    private provider: BaseProvider;
    private config: DexterConfig;

    private onDexs: BaseDex[] = [];
    private availableDexes: { [key: string]: BaseDex };
    private tokenRegistry: TokenRegistry;

    static new(provider: BaseProvider): Dexter {
        let dexter = new this();

        dexter.withProvider(provider);
        dexter.availableDexes = {
            [Minswap.name]: new Minswap(),
        };
        dexter.tokenRegistry = new TokenRegistry();

        return dexter;
    }

    withConfig(config: DexterConfig): Dexter {
        this.config = config;

        return this;
    }

    /**
     * Switch to a new provider.
     */
    withProvider(provider: BaseProvider): Dexter {
        this.provider = provider;

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

        return this;
    }

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     * All liquidity pools will be returned if assetA & assetB are not provided.
     */
    liquidityPools(assetA: Token = 'lovelace', assetB?: Token): Promise<DexterResponse> {
        return Promise.all(
            this.onDexs.map((dex: BaseDex) => dex.liquidityPools(this.provider, assetA, assetB)),
        ).then(async (mappedLiquidityPools: Awaited<LiquidityPool[]>[]) => {
            const liquidityPools: LiquidityPool[] = mappedLiquidityPools.flat();

            if (this.config.shouldFetchMetadata) {
                await this.fetchAssetMetadata(liquidityPools);
            }

            return liquidityPools.reduce((result: DexterResponse, liquidityPool?: LiquidityPool) => {
                (result[liquidityPool.dex] = result[liquidityPool.dex] || []).push(liquidityPool);

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

            if (! relevantUtxo) {
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

    private async fetchAssetMetadata(liquidityPools: LiquidityPool[]) {
        const assetIds: Array<string> = liquidityPools.reduce((assetIds: Array<string>, liquidityPool: LiquidityPool) => {
            if (liquidityPool.assetA !== 'lovelace' && !assetIds.includes(liquidityPool.assetA.id())) {
                assetIds.push(liquidityPool.assetA.id());
            }
            if (liquidityPool.assetB !== 'lovelace' && !assetIds.includes(liquidityPool.assetB.id())) {
                assetIds.push(liquidityPool.assetB.id());
            }

            return assetIds;
        }, [] as Array<string>);

        await this.tokenRegistry.metadataBatch(assetIds)
            .then((response: any) => {
                liquidityPools.forEach((liquidityPool: LiquidityPool) => {
                    [liquidityPool.assetA, liquidityPool.assetB].forEach((asset: Token) => {
                        if (! (asset instanceof Asset)) {
                            return;
                        }

                        const responseAsset = response.find((metadata: any) => {
                            return metadata.subject === asset.id();
                        });

                        asset.decimals = responseAsset.decimals.value;
                        asset.logo = responseAsset.logo.value;
                        asset.ticker = responseAsset.ticker.value;
                        asset.url = responseAsset.url.value;
                    });
                });
            });
    }

}