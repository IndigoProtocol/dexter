import { BaseDex } from './base-dex.js';
import { DatumParameters, PayToAddress, SpendUTxO, SwapFee, UTxO } from '../types.js';
import { Script } from 'lucid-cardano';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';
export declare class MinswapV2 extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly orderScriptHash: string;
    readonly cancelDatum: string;
    readonly orderScript: Script;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}
