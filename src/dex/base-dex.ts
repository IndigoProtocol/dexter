import { LiquidityPool } from './models/liquidity-pool';
import { BaseProvider } from '../provider/base-provider';
import { Token } from './models/asset';
import { UTxO } from '../types/provider';

export abstract class BaseDex {

    /**
     * Unique name for this DEX.
     */
    public abstract readonly name: string;

    /**
     * Fetch all liquidity pools matching assetA & assetB.
     */
    abstract liquidityPools(provider: BaseProvider, assetA: Token = 'lovelace', assetB?: Token): Promise<LiquidityPool[]>;

    /**
     * Submit a swap order through this DEX.
     */
    abstract submitSwap(): void;

    /**
     * Craft liquidity pool state from a valid UTxO given the matching assetA & assetB.
     */
    abstract liquidityPoolFromUtxo(utxo: UTxO, assetA: Token, assetB: Token): LiquidityPool | undefined;

}