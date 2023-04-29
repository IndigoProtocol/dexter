import { LiquidityPool } from './models/liquidity-pool';
import { DataProvider } from '../providers/data/data-provider';
import { Token } from './models/asset';
import { BuiltSwapOrder, DatumParameters, UTxO } from '../types';

export abstract class BaseDex {

    /**
     * Unique name for this DEX.
     */
    public abstract readonly name: string;

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     */
    abstract liquidityPools(provider: DataProvider, assetA: Token, assetB?: Token): Promise<LiquidityPool[]>;

    /**
     * Craft liquidity pool state from a valid UTxO given the matching assetA & assetB.
     */
    abstract liquidityPoolFromUtxo(utxo: UTxO, assetA: Token, assetB: Token): LiquidityPool | undefined;

    /**
     * Estimated swap out amount received for a swap in token & amount on a liquidity pool.
     */
    abstract estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;

    /**
     * Calculated price impact after for swap order.
     */
    abstract priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;

    /**
     * Craft a swap order for this DEX.
     */
    abstract buildSwapOrder(defaultParameters: DatumParameters): BuiltSwapOrder;

}