import { LiquidityPool } from '../dex/models/liquidity-pool';
import { Token } from '../dex/models/asset';
import { Dexter } from '../dexter';
import { tokensMatch } from '../utils';
import { BuiltSwapOrder, DatumParameters } from '../types';
import { DatumParameterKey } from '../constants';
import { SwapTransaction } from '../dex/models/swap-transaction';

export class SwapRequest {

    private dexter: Dexter;
    private liquidityPool: LiquidityPool;
    private swapInToken: Token;
    private swapOutToken: Token;
    private swapInAmount: bigint = 0n;
    private slippagePercent: number = 1.0;

    constructor(dexter: Dexter) {
        this.dexter = dexter;
    }

    forLiquidityPool(liquidityPool: LiquidityPool): SwapRequest {
        if (! Object.keys(this.dexter.availableDexs).includes(liquidityPool.dex)) {
            throw new Error(`DEX ${liquidityPool.dex} provided with the liquidity pool is not available.`);
        }

        this.liquidityPool = liquidityPool;

        return this;
    }

    withSwapInToken(swapInToken: Token): SwapRequest {
        if (! this.liquidityPool) {
            throw new Error('Liquidity pool must be set before providing an input token.');
        }

        if (tokensMatch(swapInToken, this.liquidityPool.assetA)) {
            this.swapOutToken = this.liquidityPool.assetB;
        } else if (tokensMatch(swapInToken, this.liquidityPool.assetB)) {
            this.swapOutToken = this.liquidityPool.assetA;
        } else {
            throw new Error("Input token doesn't exist in the set liquidity pool.");
        }

        this.swapInToken = swapInToken;

        return this;
    }

    flip(): SwapRequest {
        if (this.swapInToken) {
            [this.swapInToken, this.swapOutToken] = [this.swapOutToken, this.swapInToken];
        }

        return this;
    }

    withSwapInAmount(swapInAmount: bigint): SwapRequest {
        if (swapInAmount < 0n) {
            throw new Error('Swap in amount must be a positive number.');
        }

        this.swapInAmount = swapInAmount;

        return this;
    }

    withSlippagePercent(slippagePercent: number): SwapRequest {
        if (slippagePercent < 0) {
            throw new Error('Swap in amount must be a positive number.');
        }

        this.slippagePercent = slippagePercent;

        return this;
    }

    getEstimatedReceive(): bigint {
        if (! this.liquidityPool) {
            throw new Error('Liquidity pool must be set before providing calculating the estimated receive.');
        } else if (! this.swapInToken) {
            throw new Error('Swap in token must be set before providing calculating the estimated receive.');
        }

        return this.dexter.availableDexs[this.liquidityPool.dex].estimatedReceive(
            this.liquidityPool,
            this.swapInToken,
            this.swapInAmount,
        );
    }

    getMinimumReceive(): bigint {
        return BigInt(
            Math.floor(Number(this.getEstimatedReceive()) / (1 + (this.slippagePercent / 100)))
        );
    }

    getPriceImpactPercent(): number {
        if (! this.liquidityPool) {
            throw new Error('Liquidity pool must be set before providing calculating the price impact.');
        } else if (! this.swapInToken) {
            throw new Error('Swap in token must be set before providing calculating the price impact.');
        }

        return this.dexter.availableDexs[this.liquidityPool.dex].priceImpactPercent(
            this.liquidityPool,
            this.swapInToken,
            this.swapInAmount,
        );
    }

    submit() {
        if (! this.dexter.walletProvider) {
            throw new Error('Please set a wallet provider before submitting a swap order.');
        }
        if (! this.liquidityPool) {
            throw new Error('Please set a liquidity pool before submitting a swap order.');
        }
        if (! this.swapInToken) {
            throw new Error('Please set a swap in token before submitting a swap order.');
        }
        if (this.swapInAmount <= 0n) {
            throw new Error('Please set a swap in amount before submitting a swap order.');
        }

        const defaultSwapParameters: DatumParameters = {
            [DatumParameterKey.SenderPubKeyHash]: this.dexter.walletProvider.publicKeyHash(),
            [DatumParameterKey.SenderStakingKeyHash]: this.dexter.walletProvider.stakingKeyHash(),
            [DatumParameterKey.ReceiverPubKeyHash]: this.dexter.walletProvider.publicKeyHash(),
            [DatumParameterKey.ReceiverStakingKeyHash]: this.dexter.walletProvider.stakingKeyHash(),
            [DatumParameterKey.PoolIdentifier]: this.liquidityPool.identifier,
            [DatumParameterKey.SwapInAmount]: Number(this.swapInAmount),
            [DatumParameterKey.MinReceive]: Number(this.getMinimumReceive()),
            [DatumParameterKey.SwapInTokenPolicyId]: this.swapInToken === 'lovelace' ? '' : this.swapInToken.policyId,
            [DatumParameterKey.SwapInTokenAssetName]: this.swapInToken === 'lovelace' ? '' : this.swapInToken.assetNameHex,
            [DatumParameterKey.SwapOutTokenPolicyId]: this.swapOutToken === 'lovelace' ? '' : this.swapOutToken.policyId,
            [DatumParameterKey.SwapOutTokenAssetName]: this.swapOutToken === 'lovelace' ? '' : this.swapOutToken.assetNameHex,
        };

        const builtSwapOrder: BuiltSwapOrder = this.dexter.availableDexs[this.liquidityPool.dex].buildSwapOrder(defaultSwapParameters);
        const swapTransaction: SwapTransaction = new SwapTransaction();

        // onRetry

        this.sendSwapOrder(swapTransaction, builtSwapOrder);

        return swapTransaction;
    }

    private sendSwapOrder(swapTransaction: SwapTransaction, builtSwapOrder: BuiltSwapOrder) {
        // build payments
    }

}