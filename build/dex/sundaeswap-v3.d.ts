import { BaseDex } from './base-dex';
import { DatumParameters, PayToAddress, SpendUTxO, SwapFee, UTxO } from '../types';
import { Script } from 'lucid-cardano';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';
export declare class SundaeSwapV3 extends BaseDex {
    static readonly identifier: string;
    /**
     * On-Chain constants.
     */
    readonly cancelDatum: string;
    readonly orderScriptHash: string;
    readonly orderScript: Script;
    private readonly protocolFeeDefault;
    estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
    estimatedReceive(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): bigint;
    priceImpactPercent(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint): number;
    buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    swapOrderFees(): SwapFee[];
}
