import { BaseDex } from '@dex/base-dex';
import { Asset, Token } from '@dex/models/asset';
import { LiquidityPool } from '@dex/models/liquidity-pool';
import { Dexter } from '@app/dexter';
import { Transaction, UTxO } from '@app/types';
import { BaseDataProvider } from '@providers/data/base-data-provider';

export class FetchRequest {

    private _dexter: Dexter;
    private _onDexs: BaseDex[] = [];

    constructor(dexter: Dexter) {
        this._dexter = dexter;
    }

    /**
     * Set the DEX(s) Dexter will fetch data for.
     */
    public forDexs(dexs: string | string[]): FetchRequest {
        (Array.isArray(dexs) ? dexs : [dexs]).forEach((dexName: string) => {
            if (! Object.keys(this._dexter.availableDexs).includes(dexName)) {
                throw new Error(`DEX ${dexName} is not available.`);
            }

            this._onDexs = this._onDexs.filter((dex: BaseDex) => {
                return dex.name !== dexName;
            }).concat(this._dexter.availableDexs[dexName]);
        });

        return this;
    }

    /**
     * Fetch data for all available DEXs.
     */
    public forAllDexs(): FetchRequest {
        this._onDexs = Object.values(this._dexter.availableDexs);

        return this;
    }

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     * All liquidity pools will be returned if assetA & assetB are not provided.
     */
    public getLiquidityPools(assetA: Token = 'lovelace', assetB?: Token): Promise<LiquidityPool[]> {
        const liquidityPoolPromises: Promise<LiquidityPool[]>[] =
            this._onDexs.map((dex: BaseDex) => {
                if (! this._dexter.dataProvider) {
                    return dex.api.liquidityPools(assetA, assetB);
                }

                return dex.liquidityPools(this._dexter.dataProvider as BaseDataProvider, assetA, assetB)
                    .then((pools: LiquidityPool[]) => pools)
                    .catch(() => {
                        // Attempt fallback to API
                        return this._dexter.config.shouldFallbackToApi
                            ? dex.api.liquidityPools(assetA, assetB)
                            : [];
                    });
            });

        return Promise.all(
            liquidityPoolPromises,
        ).then(async (mappedLiquidityPools: Awaited<LiquidityPool[]>[]) => {
            const liquidityPools: LiquidityPool[] = mappedLiquidityPools.flat();

            if (this._dexter.config.shouldFetchMetadata) {
                await this.fetchAssetMetadata(liquidityPools);
            }

            return liquidityPools;
        });
    }

    /**
     * Fetch historic states for a liquidity pool.
     */
    public async getLiquidityPoolHistory(liquidityPool: LiquidityPool): Promise<LiquidityPool[]> {
        if (! this._dexter.dataProvider) {
            return []; // todo
        }

        const transactions: Transaction[] = await this._dexter.dataProvider.assetTransactions(liquidityPool.lpToken);

        const liquidityPoolPromises: Promise<LiquidityPool | undefined>[] = transactions.map(async (transaction: Transaction) => {
            const utxos: UTxO[] = await (this._dexter.dataProvider as BaseDataProvider)
                .transactionUtxos(transaction.txHash);

            const relevantUtxo: UTxO | undefined = utxos.find((utxo: UTxO) => {
                return utxo.address === liquidityPool.address;
            });

            if (! relevantUtxo) {
                return undefined;
            }

            return this._dexter.availableDexs[liquidityPool.dex].liquidityPoolFromUtxo(
                relevantUtxo,
                liquidityPool.assetA,
                liquidityPool.assetB
            ) as LiquidityPool | undefined;
        });

        return await Promise.all(liquidityPoolPromises)
            .then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((pool?: LiquidityPool) => {
                    return pool !== undefined;
                }) as LiquidityPool[];
            });
    }

    private async fetchAssetMetadata(liquidityPools: LiquidityPool[]) {
        const assets: Asset[] = liquidityPools.reduce((results: Asset[], liquidityPool: LiquidityPool) => {
            if (liquidityPool.assetA !== 'lovelace' && ! results.some((asset: Asset) => asset.id() === (liquidityPool.assetA as Asset).id())) {
                results.push(liquidityPool.assetA);
            }
            if (liquidityPool.assetB !== 'lovelace' && ! results.some((asset: Asset) => asset.id() === (liquidityPool.assetB as Asset).id())) {
                results.push(liquidityPool.assetB);
            }

            return results;
        }, [] as Asset[]);

        await this._dexter.metadataProvider.fetch(assets)
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
                    });
                });
            })
            .catch(() => {
                return liquidityPools;
            });
    }

}