import { MetadataKey, TransactionStatus } from '../constants';
export class SplitCancelSwapRequest {
    constructor(dexter) {
        this._cancelRequests = [];
        this._dexter = dexter;
    }
    forTransactions(mappings) {
        this._cancelRequests = mappings.map((mapping) => {
            return this._dexter.newCancelSwapRequest()
                .forTransaction(mapping.txHash)
                .forDex(mapping.dex);
        });
        return this;
    }
    submit() {
        if (!this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a cancel swap order.');
        }
        if (!this._dexter.walletProvider.isWalletLoaded) {
            throw new Error('Wallet must be loaded before submitting a cancel swap order.');
        }
        if (this._cancelRequests.length === 0) {
            throw new Error('Cancel requests were never initialized.');
        }
        const cancelTransaction = this._dexter.walletProvider.createTransaction();
        Promise.all(this._cancelRequests.map((cancelRequest) => cancelRequest.getPaymentsToAddresses()))
            .then((payToAddresses) => {
            this.sendSplitCancelSwapOrder(cancelTransaction, payToAddresses.flat());
        });
        return cancelTransaction;
    }
    sendSplitCancelSwapOrder(cancelTransaction, payToAddresses) {
        cancelTransaction.status = TransactionStatus.Building;
        cancelTransaction.attachMetadata(MetadataKey.Message, {
            msg: [
                `[${this._dexter.config.metadataMsgBranding}] Split Cancel Swap`
            ]
        });
        // Build transaction
        cancelTransaction.payToAddresses(payToAddresses)
            .then(() => {
            cancelTransaction.status = TransactionStatus.Signing;
            // Sign transaction
            cancelTransaction.sign()
                .then(() => {
                cancelTransaction.status = TransactionStatus.Submitting;
                // Submit transaction
                cancelTransaction.submit()
                    .then(() => {
                    cancelTransaction.status = TransactionStatus.Submitted;
                })
                    .catch((error) => {
                    cancelTransaction.error = {
                        step: TransactionStatus.Submitting,
                        reason: 'Failed submitting transaction.',
                        reasonRaw: error,
                    };
                    cancelTransaction.status = TransactionStatus.Errored;
                });
            })
                .catch((error) => {
                cancelTransaction.error = {
                    step: TransactionStatus.Signing,
                    reason: 'Failed to sign transaction.',
                    reasonRaw: error,
                };
                cancelTransaction.status = TransactionStatus.Errored;
            });
        })
            .catch((error) => {
            cancelTransaction.error = {
                step: TransactionStatus.Building,
                reason: 'Failed to build transaction.',
                reasonRaw: error,
            };
            cancelTransaction.status = TransactionStatus.Errored;
        });
    }
}
