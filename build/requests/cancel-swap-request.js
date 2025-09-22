import { MetadataKey, TransactionStatus } from '../constants';
export class CancelSwapRequest {
    constructor(dexter) {
        this._dexter = dexter;
    }
    forTransaction(txHash) {
        this._txHash = txHash;
        return this;
    }
    forDex(name) {
        this._dexName = name;
        return this;
    }
    getPaymentsToAddresses() {
        if (!this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a swap order.');
        }
        const returnAddress = this._dexter.walletProvider.address();
        return this._dexter.dataProvider.transactionUtxos(this._txHash)
            .then((utxos) => {
            return this._dexter.availableDexs[this._dexName].buildCancelSwapOrder(utxos, returnAddress);
        })
            .catch(() => {
            throw new Error('Unable to grab UTxOs for the provided Tx hash. Ensure the one provided is a valid Tx hash.');
        });
    }
    cancel() {
        if (!this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a swap order.');
        }
        if (!this._txHash) {
            throw new Error('Tx hash must be provided before cancelling a swap order.');
        }
        if (!this._dexName) {
            throw new Error('DEX must be provided before cancelling a swap order.');
        }
        const cancelTransaction = this._dexter.walletProvider.createTransaction();
        this.getPaymentsToAddresses()
            .then((payToAddresses) => {
            this.sendCancelOrder(cancelTransaction, payToAddresses);
        })
            .catch((error) => {
            throw new Error(`Unable to cancel swap order. ${error}`);
        });
        return cancelTransaction;
    }
    sendCancelOrder(cancelTransaction, payToAddresses) {
        cancelTransaction.status = TransactionStatus.Building;
        cancelTransaction.attachMetadata(MetadataKey.Message, {
            msg: [
                `[${this._dexter.config.metadataMsgBranding}] ${this._dexName} Cancel Swap`
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
