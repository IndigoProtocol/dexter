import { LiquidityPool } from '@dex/models/liquidity-pool';
import { Token } from '@dex/models/asset';
import { Dexter } from '@app/dexter';
import { PayToAddress, SwapFee, SwapInAmountMapping, SwapOutAmountMapping, UTxO } from '@app/types';
import { MetadataKey, TransactionStatus } from '@app/constants';
import { DexTransaction } from '@dex/models/dex-transaction';
import { SwapRequest } from '@requests/swap-request';

export class SplitSwapRequest {

    private _dexter: Dexter;
    private _swapRequests: SwapRequest[] = [];
    private _swapInToken: Token;
    private _swapOutToken: Token;
    private _slippagePercent: number = 1.0;

    constructor(dexter: Dexter) {
        this._dexter = dexter;
    }

    get liquidityPools(): LiquidityPool[] {
        return this._swapRequests.map((swapRequest: SwapRequest) => swapRequest.liquidityPool);
    }

    get swapRequests(): SwapRequest[] {
        return this._swapRequests;
    }

    get swapInToken(): Token {
        return this._swapInToken;
    }

    get swapOutToken(): Token {
        return this._swapOutToken;
    }

    get swapInAmount(): bigint {
        return this._swapRequests.reduce((totalSwapInAmount: bigint, swapRequest: SwapRequest) => {
            return totalSwapInAmount + swapRequest.swapInAmount;
        }, 0n);
    }

    get slippagePercent(): number {
        return this._slippagePercent;
    }

    public flip(): SplitSwapRequest {
        this._swapRequests.forEach((swapRequest: SwapRequest) => {
           swapRequest.flip();
        });

        return this;
    }

    public withSwapInToken(swapInToken: Token): SplitSwapRequest {
        this._swapInToken = swapInToken;

        return this;
    }

    public withSwapOutToken(swapOutToken: Token): SplitSwapRequest {
        this._swapOutToken = swapOutToken;

        return this;
    }

    public withSwapInAmountMappings(mappings: SwapInAmountMapping[]): SplitSwapRequest {
        if (! this._swapInToken) {
            throw new Error('Swap-in token must be set before setting the pool mappings.');
        }

        this.isValidLiquidityPoolMappings(
            mappings.map((mapping: SwapInAmountMapping) => mapping.liquidityPool)
        );

        this._swapRequests = mappings.map((mapping: SwapInAmountMapping) => {
            return this._dexter.newSwapRequest()
                .forLiquidityPool(mapping.liquidityPool)
                .withSwapInToken(this._swapInToken)
                .withSlippagePercent(this._slippagePercent)
                .withSwapInAmount(mapping.swapInAmount);
        });

        return this;
    }

    public withSwapOutAmountMappings(mappings: SwapOutAmountMapping[]): SplitSwapRequest {
        if (! this._swapOutToken) {
            throw new Error('Swap-out token must be set before setting the pool mappings.');
        }

        this.isValidLiquidityPoolMappings(
            mappings.map((mapping: SwapOutAmountMapping) => mapping.liquidityPool)
        );

        this._swapRequests = mappings.map((mapping: SwapOutAmountMapping) => {
            return this._dexter.newSwapRequest()
                .forLiquidityPool(mapping.liquidityPool)
                .withSwapOutToken(this._swapOutToken)
                .withSlippagePercent(this._slippagePercent)
                .withSwapOutAmount(mapping.swapOutAmount);
        })

        return this;
    }

    public withSlippagePercent(slippagePercent: number): SplitSwapRequest {
        if (slippagePercent < 0) {
            throw new Error('Slippage percent must be zero or above.');
        }

        if (this._swapRequests.length > 0) {
            this._swapRequests.forEach((swapRequest: SwapRequest) => {
                swapRequest.withSlippagePercent(slippagePercent);
            });
        }

        this._slippagePercent = slippagePercent;

        return this;
    }

    public withUtxos(utxos: UTxO[]): SplitSwapRequest {
        if (utxos.length === 0) {
            throw new Error('Must provide valid UTxOs to use in swap.');
        }

        this._swapRequests.forEach((swapRequest: SwapRequest) => {
           swapRequest.withUtxos(utxos);
        });

        return this;
    }

    public getEstimatedReceive(): bigint {
        return this._swapRequests.reduce((totalEstimatedReceive: bigint, swapRequest: SwapRequest) => {
            return totalEstimatedReceive + swapRequest.getEstimatedReceive();
        }, 0n);
    }

    public getMinimumReceive(): bigint {
        return this._swapRequests.reduce((totalMinimumReceive: bigint, swapRequest: SwapRequest) => {
            return totalMinimumReceive + swapRequest.getMinimumReceive();
        }, 0n);
    }

    public getAvgPriceImpactPercent(): number {
        if (this._swapRequests.length === 0) return 0;

        const totalPriceImpactPercent: number = this._swapRequests.reduce((totalPriceImpactPercent: number, swapRequest: SwapRequest) => {
            return totalPriceImpactPercent + swapRequest.getPriceImpactPercent();
        }, 0);

        if (totalPriceImpactPercent === 0) return 0;

        return totalPriceImpactPercent / this._swapRequests.length;
    }

    public getSwapFees(): SwapFee[] {
        return this._swapRequests.map((swapRequest: SwapRequest) => {
            return this._dexter.availableDexs[swapRequest.liquidityPool.dex].swapOrderFees();
        }).flat();
    }

    public submit(): DexTransaction {
        if (! this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a swap order.');
        }
        if (! this._dexter.walletProvider.isWalletLoaded) {
            throw new Error('Wallet must be loaded before submitting a swap order.');
        }
        if (this._swapRequests.length === 0) {
            throw new Error('Swap requests were never initialized.');
        }

        const swapTransaction: DexTransaction = this._dexter.walletProvider.createTransaction();

        Promise.all(this._swapRequests.map((swapRequest: SwapRequest) => swapRequest.getPaymentsToAddresses()))
            .then((payToAddresses: PayToAddress[][]) => {
                this.sendSplitSwapOrder(swapTransaction, payToAddresses.flat());
            });

        return swapTransaction;
    }

    private sendSplitSwapOrder(splitSwapTransaction: DexTransaction, payToAddresses: PayToAddress[]) {
        splitSwapTransaction.status = TransactionStatus.Building;

        const swapInTokenName: string = this._swapInToken === 'lovelace' ? 'ADA' : this._swapInToken.assetName;
        const swapOutTokenName: string = this._swapOutToken === 'lovelace' ? 'ADA' : this._swapOutToken.assetName;
        splitSwapTransaction.attachMetadata(MetadataKey.Message, {
            msg: [
                `[${this._dexter.config.metadataMsgBranding}] Split ${swapInTokenName} -> ${swapOutTokenName} Swap`
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

    private isValidLiquidityPoolMappings(liquidityPools: LiquidityPool[]): void {
        // Validate provided DEXs are available
        liquidityPools
            .map((pool: LiquidityPool) => pool.dex)
            .forEach((dex: string) => {
                if (! Object.keys(this._dexter.availableDexs).includes(dex)) {
                    throw new Error(`DEX ${dex} provided with the liquidity pool is not available.`);
                }
            });
    }

}
