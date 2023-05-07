import { LiquidityPool } from '../dex/models/liquidity-pool';
import { Token } from '../dex/models/asset';
import { Dexter } from '../dexter';
import { tokensMatch } from '../utils';
import { DatumParameters, PayToAddress } from '../types';
import { DatumParameterKey, TransactionStatus } from '../constants';
import { DexTransaction } from '../dex/models/dex-transaction';

export class SwapRequest {

    private _dexter: Dexter;
    private _liquidityPool: LiquidityPool;
    private _swapInToken: Token;
    private _swapOutToken: Token;
    private _swapInAmount: bigint = 0n;
    private _slippagePercent: number = 1.0;

    constructor(dexter: Dexter) {
        this._dexter = dexter;
    }

    get liquidityPool(): LiquidityPool {
        return this._liquidityPool;
    }

    get swapInToken(): Token {
        return this._swapInToken;
    }

    get swapOutToken(): Token {
        return this._swapOutToken;
    }

    get swapInAmount(): bigint {
        return this._swapInAmount;
    }

    get slippagePercent(): number {
        return this._slippagePercent;
    }

    public forLiquidityPool(liquidityPool: LiquidityPool): SwapRequest {
        if (! Object.keys(this._dexter.availableDexs).includes(liquidityPool.dex)) {
            throw new Error(`DEX ${liquidityPool.dex} provided with the liquidity pool is not available.`);
        }

        this._liquidityPool = liquidityPool;

        return this;
    }

    public withSwapInToken(swapInToken: Token): SwapRequest {
        if (! this._liquidityPool) {
            throw new Error('Liquidity pool must be set before providing an input token.');
        }

        if (tokensMatch(swapInToken, this._liquidityPool.assetA)) {
            this._swapOutToken = this._liquidityPool.assetB;
        } else if (tokensMatch(swapInToken, this._liquidityPool.assetB)) {
            this._swapOutToken = this._liquidityPool.assetA;
        } else {
            throw new Error("Input token doesn't exist in the set liquidity pool.");
        }

        this._swapInToken = swapInToken;

        return this;
    }

    public flip(): SwapRequest {
        if (this._swapInToken) {
            [this._swapInToken, this._swapOutToken] = [this._swapOutToken, this._swapInToken];
        }

        return this;
    }

    public withSwapInAmount(swapInAmount: bigint): SwapRequest {
        if (swapInAmount < 0n) {
            throw new Error('Swap in amount must be a positive number.');
        }

        this._swapInAmount = swapInAmount;

        return this;
    }

    public withSlippagePercent(slippagePercent: number): SwapRequest {
        if (slippagePercent < 0) {
            throw new Error('Swap in amount must be a positive number.');
        }

        this._slippagePercent = slippagePercent;

        return this;
    }

    public getEstimatedReceive(): bigint {
        if (! this._liquidityPool) {
            throw new Error('Liquidity pool must be set before providing calculating the estimated receive.');
        } else if (! this._swapInToken) {
            throw new Error('Swap in token must be set before providing calculating the estimated receive.');
        }

        return this._dexter.availableDexs[this._liquidityPool.dex].estimatedReceive(
            this._liquidityPool,
            this._swapInToken,
            this._swapInAmount,
        );
    }

    public getMinimumReceive(): bigint {
        return BigInt(
            Math.floor(Number(this.getEstimatedReceive()) / (1 + (this._slippagePercent / 100)))
        );
    }

    public getPriceImpactPercent(): number {
        if (! this._liquidityPool) {
            throw new Error('Liquidity pool must be set before providing calculating the price impact.');
        } else if (! this._swapInToken) {
            throw new Error('Swap in token must be set before providing calculating the price impact.');
        }

        return this._dexter.availableDexs[this._liquidityPool.dex].priceImpactPercent(
            this._liquidityPool,
            this._swapInToken,
            this._swapInAmount,
        );
    }

    public submit(): DexTransaction {
        if (! this._dexter.walletProvider) {
            throw new Error('Please set a wallet provider before submitting a swap order.');
        }
        if (! this._liquidityPool) {
            throw new Error('Please set a liquidity pool before submitting a swap order.');
        }
        if (! this._swapInToken) {
            throw new Error('Please set a swap in token before submitting a swap order.');
        }
        if (this._swapInAmount <= 0n) {
            throw new Error('Please set a swap in amount before submitting a swap order.');
        }

        // Standard parameters for a swap order
        const defaultSwapParameters: DatumParameters = {
            [DatumParameterKey.SenderPubKeyHash]: this._dexter.walletProvider.publicKeyHash(),
            [DatumParameterKey.SenderStakingKeyHash]: this._dexter.walletProvider.stakingKeyHash(),
            [DatumParameterKey.ReceiverPubKeyHash]: this._dexter.walletProvider.publicKeyHash(),
            [DatumParameterKey.ReceiverStakingKeyHash]: this._dexter.walletProvider.stakingKeyHash(),
            [DatumParameterKey.PoolIdentifier]: this._liquidityPool.identifier,
            [DatumParameterKey.SwapInAmount]: this._swapInAmount,
            [DatumParameterKey.MinReceive]: this.getMinimumReceive(),
            [DatumParameterKey.SwapInTokenPolicyId]: this._swapInToken === 'lovelace' ? '' : this._swapInToken.policyId,
            [DatumParameterKey.SwapInTokenAssetName]: this._swapInToken === 'lovelace' ? '' : this._swapInToken.assetNameHex,
            [DatumParameterKey.SwapOutTokenPolicyId]: this._swapOutToken === 'lovelace' ? '' : this._swapOutToken.policyId,
            [DatumParameterKey.SwapOutTokenAssetName]: this._swapOutToken === 'lovelace' ? '' : this._swapOutToken.assetNameHex,
        };

        const swapTransaction: DexTransaction = this._dexter.walletProvider.createTransaction();

        this._dexter.availableDexs[this._liquidityPool.dex].buildSwapOrder(defaultSwapParameters)
            .then((payToAddresses: PayToAddress[]) => {
                this.sendSwapOrder(swapTransaction, payToAddresses);
            });

        return swapTransaction;
    }

    private sendSwapOrder(swapTransaction: DexTransaction, payToAddresses: PayToAddress[]) {
        swapTransaction.status = TransactionStatus.Building;

        // Build transaction
        swapTransaction.payToAddresses(payToAddresses)
            .then(() => {
                swapTransaction.status = TransactionStatus.Signing;

                // Sign transaction
                swapTransaction.sign()
                    .then(() => {
                        swapTransaction.status = TransactionStatus.Submitting;

                        // Submit transaction
                        swapTransaction.submit()
                            .then(() => {
                                swapTransaction.status = TransactionStatus.Submitted;
                            });
                    });
            });
    }

}