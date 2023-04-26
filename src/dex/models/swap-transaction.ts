import { DexTransaction } from './dex-transaction';
import { LiquidityPool } from './liquidity-pool';
import { Token } from './asset';

export class SwapTransaction extends DexTransaction {

    public liquidityPool: LiquidityPool;
    public swapInToken: Token;
    public swapInAmount: bigint;

    constructor(liquidityPool: LiquidityPool, swapInToken: Token, swapInAmount: bigint) {
        super();

        this.liquidityPool = liquidityPool;
        this.swapInToken = swapInToken;
        this.swapInAmount = swapInAmount;
    }
}