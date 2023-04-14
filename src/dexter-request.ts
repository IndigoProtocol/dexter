import { BaseDex } from './dex/base-dex';
import { Asset, Token } from './dex/models/asset';
import { DexterResponse } from './types/global';
import { LiquidityPool } from './dex/models/liquidity-pool';
import { Transaction, UTxO } from './types/provider';
import { Dexter } from './dexter';

export class DexterRequest {

    private onDexs: BaseDex[] = [];
    private dexter: Dexter;

    constructor(dexter: Dexter) {
        this.dexter = dexter;
    }

    /**
     * Set the DEX(s) Dexter will fetch data for.
     */
    for(dexs: string | string[]): DexterRequest {
        (Array.isArray(dexs) ? dexs : [dexs]).forEach((dexName: string) => {
            if (! Object.keys(this.dexter.availableDexs).includes(dexName)) {
                throw new Error(`DEX ${dexName} is not available.`);
            }

            this.onDexs = this.onDexs.filter((dex: BaseDex) => {
                return dex.name !== dexName;
            }).concat(this.dexter.availableDexs[dexName]);
        });

        return this;
    }

    /**
     * Fetch data for all available DEXs.
     */
    forAll(): DexterRequest {
        this.onDexs = Object.values(this.dexter.availableDexs);

        return this;
    }

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     * All liquidity pools will be returned if assetA & assetB are not provided.
     */
    getLiquidityPools(assetA: Token = 'lovelace', assetB?: Token): Promise<DexterResponse> {
        return Promise.all(
            this.onDexs.map((dex: BaseDex) => dex.liquidityPools(this.dexter.provider, assetA, assetB)),
        ).then(async (mappedLiquidityPools: Awaited<LiquidityPool[]>[]) => {
            const liquidityPools: LiquidityPool[] = mappedLiquidityPools.flat();

            if (this.dexter.config.shouldFetchMetadata) {
                await this.fetchAssetMetadata(liquidityPools);
            }

            return liquidityPools.reduce((result: DexterResponse, liquidityPool?: LiquidityPool) => {
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
    async getLiquidityPoolHistory(liquidityPool: LiquidityPool): Promise<LiquidityPool[]> {
        const transactions: Transaction[] = await this.dexter.provider.assetTransactions(liquidityPool.lpToken.id());

        const liquidityPoolPromises: Promise<LiquidityPool | undefined>[] = transactions.map(async (transaction: Transaction) => {
            const utxos: UTxO[] = await this.dexter.provider.transactionUtxos(transaction.txHash);

            const relevantUtxo: UTxO | undefined = utxos.find((utxo: UTxO) => {
                return utxo.address === liquidityPool.address;
            });

            if (! relevantUtxo) {
                return undefined;
            }

            return this.dexter.availableDexs[liquidityPool.dex].liquidityPoolFromUtxo(
                relevantUtxo,
                liquidityPool.assetA,
                liquidityPool.assetB
            ) as LiquidityPool | undefined;
        });

        return await Promise.all(liquidityPoolPromises)
            .then((liquidityPools: (LiquidityPool | undefined)[]) => {
                return liquidityPools.filter((liquidityPool?: LiquidityPool) => {
                    return liquidityPool !== undefined;
                }) as LiquidityPool[];
            });
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

        await this.dexter.tokenRegistry.metadataBatch(assetIds)
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