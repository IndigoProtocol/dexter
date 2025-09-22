import { MetadataKey, TransactionStatus } from '../constants';
export class SplitSwapRequest {
    constructor(dexter) {
        this._swapRequests = [];
        this._slippagePercent = 1.0;
        this._metadata = '';
        this._dexter = dexter;
    }
    get liquidityPools() {
        return this._swapRequests.map((swapRequest) => swapRequest.liquidityPool);
    }
    get swapRequests() {
        return this._swapRequests;
    }
    get swapInToken() {
        return this._swapInToken;
    }
    get swapOutToken() {
        return this._swapOutToken;
    }
    get swapInAmount() {
        return this._swapRequests.reduce((totalSwapInAmount, swapRequest) => {
            return totalSwapInAmount + swapRequest.swapInAmount;
        }, 0n);
    }
    get slippagePercent() {
        return this._slippagePercent;
    }
    flip() {
        this._swapRequests.forEach((swapRequest) => {
            swapRequest.flip();
        });
        return this;
    }
    withMetadata(metadata) {
        this._metadata = metadata;
        return this;
    }
    withSwapInToken(swapInToken) {
        this._swapInToken = swapInToken;
        return this;
    }
    withSwapOutToken(swapOutToken) {
        this._swapOutToken = swapOutToken;
        return this;
    }
    withSwapInAmountMappings(mappings) {
        if (!this._swapInToken) {
            throw new Error('Swap-in token must be set before setting the pool mappings.');
        }
        this.isValidLiquidityPoolMappings(mappings.map((mapping) => mapping.liquidityPool));
        this._swapRequests = mappings.map((mapping) => {
            return this._dexter.newSwapRequest()
                .forLiquidityPool(mapping.liquidityPool)
                .withSwapInToken(this._swapInToken)
                .withSlippagePercent(this._slippagePercent)
                .withSwapInAmount(mapping.swapInAmount);
        });
        return this;
    }
    withSwapOutAmountMappings(mappings) {
        if (!this._swapOutToken) {
            throw new Error('Swap-out token must be set before setting the pool mappings.');
        }
        this.isValidLiquidityPoolMappings(mappings.map((mapping) => mapping.liquidityPool));
        this._swapRequests = mappings.map((mapping) => {
            return this._dexter.newSwapRequest()
                .forLiquidityPool(mapping.liquidityPool)
                .withSwapOutToken(this._swapOutToken)
                .withSlippagePercent(this._slippagePercent)
                .withSwapOutAmount(mapping.swapOutAmount);
        });
        return this;
    }
    withSlippagePercent(slippagePercent) {
        if (slippagePercent < 0) {
            throw new Error('Slippage percent must be zero or above.');
        }
        if (this._swapRequests.length > 0) {
            this._swapRequests.forEach((swapRequest) => {
                swapRequest.withSlippagePercent(slippagePercent);
            });
        }
        this._slippagePercent = slippagePercent;
        return this;
    }
    withUtxos(utxos) {
        if (utxos.length === 0) {
            throw new Error('Must provide valid UTxOs to use in swap.');
        }
        this._swapRequests.forEach((swapRequest) => {
            swapRequest.withUtxos(utxos);
        });
        return this;
    }
    getEstimatedReceive() {
        return this._swapRequests.reduce((totalEstimatedReceive, swapRequest) => {
            return totalEstimatedReceive + swapRequest.getEstimatedReceive();
        }, 0n);
    }
    getMinimumReceive() {
        return this._swapRequests.reduce((totalMinimumReceive, swapRequest) => {
            return totalMinimumReceive + swapRequest.getMinimumReceive();
        }, 0n);
    }
    getAvgPriceImpactPercent() {
        if (this._swapRequests.length === 0)
            return 0;
        const totalPriceImpactPercent = this._swapRequests.reduce((totalPriceImpactPercent, swapRequest) => {
            return totalPriceImpactPercent + swapRequest.getPriceImpactPercent();
        }, 0);
        if (totalPriceImpactPercent === 0)
            return 0;
        return totalPriceImpactPercent / this._swapRequests.length;
    }
    getSwapFees() {
        return this._swapRequests.map((swapRequest) => {
            return this._dexter.availableDexs[swapRequest.liquidityPool.dex].swapOrderFees();
        }).flat();
    }
    submit() {
        if (!this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a swap order.');
        }
        if (!this._dexter.walletProvider.isWalletLoaded) {
            throw new Error('Wallet must be loaded before submitting a swap order.');
        }
        if (this._swapRequests.length === 0) {
            throw new Error('Swap requests were never initialized.');
        }
        const swapTransaction = this._dexter.walletProvider.createTransaction();
        Promise.all(this._swapRequests.map((swapRequest) => swapRequest.getPaymentsToAddresses()))
            .then((payToAddresses) => {
            this.sendSplitSwapOrder(swapTransaction, payToAddresses.flat());
        });
        return swapTransaction;
    }
    sendSplitSwapOrder(splitSwapTransaction, payToAddresses) {
        splitSwapTransaction.status = TransactionStatus.Building;
        const swapInTokenName = this._swapInToken === 'lovelace' ? 'ADA' : this._swapInToken.readableTicker;
        const swapOutTokenName = this._swapOutToken === 'lovelace' ? 'ADA' : this._swapOutToken.readableTicker;
        splitSwapTransaction.attachMetadata(MetadataKey.Message, {
            msg: [
                this._metadata !== '' ? this._metadata : `[${this._dexter.config.metadataMsgBranding}] Split ${swapInTokenName} -> ${swapOutTokenName} Swap`
            ]
        });
        // Build transaction
        splitSwapTransaction.payToAddresses(payToAddresses)
            .then(() => {
            splitSwapTransaction.status = TransactionStatus.Signing;
            // Sign transaction
            splitSwapTransaction.sign()
                .then(() => {
                splitSwapTransaction.status = TransactionStatus.Submitting;
                // Submit transaction
                splitSwapTransaction.submit()
                    .then(() => {
                    splitSwapTransaction.status = TransactionStatus.Submitted;
                })
                    .catch((error) => {
                    splitSwapTransaction.error = {
                        step: TransactionStatus.Submitting,
                        reason: 'Failed submitting transaction.',
                        reasonRaw: error,
                    };
                    splitSwapTransaction.status = TransactionStatus.Errored;
                });
            })
                .catch((error) => {
                splitSwapTransaction.error = {
                    step: TransactionStatus.Signing,
                    reason: 'Failed to sign transaction.',
                    reasonRaw: error,
                };
                splitSwapTransaction.status = TransactionStatus.Errored;
            });
        })
            .catch((error) => {
            splitSwapTransaction.error = {
                step: TransactionStatus.Building,
                reason: 'Failed to build transaction.',
                reasonRaw: error,
            };
            splitSwapTransaction.status = TransactionStatus.Errored;
        });
    }
    isValidLiquidityPoolMappings(liquidityPools) {
        // Validate provided DEXs are available
        liquidityPools
            .map((pool) => pool.dex)
            .forEach((dex) => {
            if (!Object.keys(this._dexter.availableDexs).includes(dex)) {
                throw new Error(`DEX ${dex} provided with the liquidity pool is not available.`);
            }
        });
    }
}
