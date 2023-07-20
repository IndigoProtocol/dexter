import { LiquidityPool } from '@dex/models/liquidity-pool';
import { Token } from '@dex/models/asset';
import { Dexter } from '@app/dexter';
import { tokensMatch } from '@app/utils';
import { AssetBalance, DatumParameters, PayToAddress, SwapFee, UTxO } from '@app/types';
import { DatumParameterKey, MetadataKey, TransactionStatus } from '@app/constants';
import { DexTransaction } from '@dex/models/dex-transaction';

export class SwapRequest {

    private _dexter: Dexter;
    private _liquidityPool: LiquidityPool;
    private _swapInToken: Token;
    private _swapOutToken: Token;
    private _swapInAmount: bigint = 0n;
    private _slippagePercent: number = 1.0;
    private _withUtxos: UTxO[] = [];

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

    public flip(): SwapRequest {
        if (this._swapInToken) {
            [this._swapInToken, this._swapOutToken] = [this._swapOutToken, this._swapInToken];
            this.withSwapOutAmount(this._swapInAmount);
        }

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

    public withSwapOutToken(swapOutToken: Token): SwapRequest {
        if (! this._liquidityPool) {
            throw new Error('Liquidity pool must be set before providing an input token.');
        }

        if (tokensMatch(swapOutToken, this._liquidityPool.assetA)) {
            this._swapInToken = this._liquidityPool.assetB;
        } else if (tokensMatch(swapOutToken, this._liquidityPool.assetB)) {
            this._swapInToken = this._liquidityPool.assetA;
        } else {
            throw new Error("Output token doesn't exist in the set liquidity pool.");
        }

        this._swapOutToken = swapOutToken;

        return this;
    }

    public withSwapInAmount(swapInAmount: bigint): SwapRequest {
        this._swapInAmount = swapInAmount > 0n ? swapInAmount : 0n;

        return this;
    }

    public withSwapOutAmount(swapOutAmount: bigint): SwapRequest {
        if (swapOutAmount <= 0n) {
            this._swapInAmount = 0n;
        }
        if (! this._liquidityPool) {
            throw new Error('Liquidity pool must be set before setting a swap out amount.');
        }

        this._swapInAmount = this._dexter.availableDexs[this._liquidityPool.dex].estimatedGive(
            this._liquidityPool,
            this._swapOutToken,
            swapOutAmount,
        );

        return this;
    }

    public withSlippagePercent(slippagePercent: number): SwapRequest {
        if (slippagePercent < 0) {
            throw new Error('Slippage percent must be zero or above.');
        }

        this._slippagePercent = slippagePercent;

        return this;
    }

    public withUtxos(utxos: UTxO[]): SwapRequest {
        if (utxos.length === 0) {
            throw new Error('Must provide valid UTxOs to use in swap.');
        }

        this._withUtxos = utxos;

        return this;
    }

    public getEstimatedReceive(liquidityPool?: LiquidityPool): bigint {
        const poolToCheck: LiquidityPool | undefined = liquidityPool ?? this._liquidityPool;

        if (! poolToCheck) {
            throw new Error('Liquidity pool must be set before calculating the estimated receive.');
        }
        if (! this._swapInToken) {
            throw new Error('Swap in token must be set before calculating the estimated receive.');
        }

        return this._dexter.availableDexs[this._liquidityPool.dex].estimatedReceive(
            poolToCheck,
            this._swapInToken,
            this._swapInAmount,
        );
    }

    public getMinimumReceive(liquidityPool?: LiquidityPool): bigint {
        return BigInt(
            Math.floor(Number(this.getEstimatedReceive(liquidityPool)) / (1 + (this._slippagePercent / 100)))
        );
    }

    public getPriceImpactPercent(): number {
        if (! this._liquidityPool) {
            throw new Error('Liquidity pool must be set before calculating the price impact.');
        }
        if (! this._swapInToken) {
            throw new Error('Swap in token must be set before calculating the price impact.');
        }

        return this._dexter.availableDexs[this._liquidityPool.dex].priceImpactPercent(
            this._liquidityPool,
            this._swapInToken,
            this._swapInAmount,
        );
    }

    public getSwapFees(): SwapFee[] {
        return this._dexter.availableDexs[this._liquidityPool.dex].swapOrderFees();
    }

    public submit(): DexTransaction {
        if (! this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a swap order.');
        }
        if (! this._dexter.walletProvider.isWalletLoaded) {
            throw new Error('Wallet must be loaded before submitting a swap order.');
        }
        if (! this._liquidityPool) {
            throw new Error('Liquidity pool must be set before submitting a swap order.');
        }
        if (! this._swapInToken) {
            throw new Error('Swap in token must be set before submitting a swap order.');
        }
        if (this._swapInAmount <= 0n) {
            throw new Error('Swap in amount must be set before submitting a swap order.');
        }

        const swapTransaction: DexTransaction = this._dexter.walletProvider.createTransaction();

        if (! this._dexter.config.shouldSubmitOrders) {
            return swapTransaction;
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
            [DatumParameterKey.SwapInTokenAssetName]: this._swapInToken === 'lovelace' ? '' : this._swapInToken.nameHex,
            [DatumParameterKey.SwapOutTokenPolicyId]: this._swapOutToken === 'lovelace' ? '' : this._swapOutToken.policyId,
            [DatumParameterKey.SwapOutTokenAssetName]: this._swapOutToken === 'lovelace' ? '' : this._swapOutToken.nameHex,
        };

        this._dexter.availableDexs[this._liquidityPool.dex].buildSwapOrder(this._liquidityPool, defaultSwapParameters, this._withUtxos)
            .then((payToAddresses: PayToAddress[]) => {
                this.sendSwapOrder(swapTransaction, payToAddresses);
            });

        return swapTransaction;
    }

    private sendSwapOrder(swapTransaction: DexTransaction, payToAddresses: PayToAddress[]) {
        swapTransaction.status = TransactionStatus.Building;

        const swapInTokenName: string = this._swapInToken === 'lovelace' ? 'ADA' : this._swapInToken.assetName;
        const swapOutTokenName: string = this._swapOutToken === 'lovelace' ? 'ADA' : this._swapOutToken.assetName;
        swapTransaction.attachMetadata(MetadataKey.Message, {
            msg: [
                `[${this._dexter.config.metadataMsgBranding}] ${this._liquidityPool.dex} ${swapInTokenName} -> ${swapOutTokenName} Swap`
            ]
        });

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
                            })
                            .catch((error) => {
                                swapTransaction.status = TransactionStatus.Errored;
                                swapTransaction.error = {
                                    step: TransactionStatus.Submitting,
                                    reason: 'Failed submitting transaction.',
                                    reasonRaw: error,
                                };
                            });
                    })
                    .catch((error) => {
                        swapTransaction.status = TransactionStatus.Errored;
                        swapTransaction.error = {
                            step: TransactionStatus.Signing,
                            reason: 'Failed to sign transaction.',
                            reasonRaw: error,
                        };
                    });
            })
            .catch((error) => {
                swapTransaction.status = TransactionStatus.Errored;
                swapTransaction.error = {
                    step: TransactionStatus.Building,
                    reason: 'Failed to build transaction.',
                    reasonRaw: error,
                };
            });
    }

}
