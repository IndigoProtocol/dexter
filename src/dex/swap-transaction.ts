import { DexTransaction } from './dex-transaction';
import { LiquidityPool } from './models/liquidity-pool';
import { Token } from './models/asset';

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