import { DatumParameters, PayToAddress, SpendUTxO, SwapFee, UTxO } from '../types.js';
import { LiquidityPool, Token } from '@indigo-labs/iris-sdk';
import { Dexter } from '../dexter.js';
export declare abstract class BaseDex {
    protected dexter: Dexter;
    constructor(dexter: Dexter);
    /**
     * Estimated swap in amount given for a swap out token & amount on a liquidity pool.
     */
    abstract estimatedGive(liquidityPool: LiquidityPool, swapOutToken: Token, swapOutAmount: bigint): bigint;
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
    abstract buildSwapOrder(liquidityPool: LiquidityPool, swapParameters: DatumParameters, spendUtxos?: SpendUTxO[]): Promise<PayToAddress[]>;
    /**
     * Craft a swap order cancellation for this DEX.
     */
    abstract buildCancelSwapOrder(txOutputs: UTxO[], returnAddress: string): Promise<PayToAddress[]>;
    /**
     * Fees associated with submitting a swap order.
     */
    abstract swapOrderFees(liquidityPool?: LiquidityPool, swapInToken?: Token, swapInAmount?: bigint): SwapFee[];
    /**
     * Adjust the payment for the DEX order address to include the swap in amount.
     */
    protected buildSwapOrderPayment(swapParameters: DatumParameters, orderPayment: PayToAddress): PayToAddress;
}
