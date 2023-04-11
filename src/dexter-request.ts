import { BaseDex } from './dex/base-dex';
import { Token } from './dex/models/asset';
import { AvailableDexs, DexterConfig, DexterResponse } from './types/global';
import { LiquidityPool } from './dex/models/liquidity-pool';
import { Transaction, UTxO } from './types/provider';
import { BaseProvider } from './provider/base-provider';

export class DexterRequest {

    private onDexs: BaseDex[] = [];

    private readonly provider: BaseProvider;
    private readonly config: DexterConfig;
    private readonly availableDexs: AvailableDexs;

    constructor(provider: BaseProvider, config: DexterConfig, availableDexs: AvailableDexs) {
        this.provider = provider;
        this.config = config;
        this.availableDexs = availableDexs;
    }

    /**
     * Set the DEX(s) Dexter will fetch data for.
     */
    for(dexs: string | string[]): DexterRequest {
        (Array.isArray(dexs) ? dexs : [dexs]).forEach((dexName: string) => {
            if (! Object.keys(this.availableDexs).includes(dexName)) {
                throw new Error(`DEX ${dexName} is not available.`);
            }

            this.onDexs = this.onDexs.filter((dex: BaseDex) => {
                return dex.name !== dexName;
            }).concat(this.availableDexs[dexName]);
        });

        return this;
    }

    /**
     * Fetch data for all available DEXs.
     */
    forAll(): DexterRequest {
        this.onDexs = Object.values(this.availableDexs);

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

            return this.availableDexs[liquidityPool.dex].liquidityPoolFromUtxo(
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

        // await this.tokenRegistry.metadataBatch(assetIds)
        //     .then((response: any) => {
        //         liquidityPools.forEach((liquidityPool: LiquidityPool) => {
        //             [liquidityPool.assetA, liquidityPool.assetB].forEach((asset: Token) => {
        //                 if (! (asset instanceof Asset)) {
        //                     return;
        //                 }
        //
        //                 const responseAsset = response.find((metadata: any) => {
        //                     return metadata.subject === asset.id();
        //                 });
        //
        //                 asset.decimals = responseAsset.decimals.value;
        //                 asset.logo = responseAsset.logo.value;
        //                 asset.ticker = responseAsset.ticker.value;
        //                 asset.url = responseAsset.url.value;
        //             });
        //         });
        //     });
    }

}