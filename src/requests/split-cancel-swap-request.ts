import { Dexter } from '@app/dexter';
import { CancelSwapRequest } from '@requests/cancel-swap-request';
import { PayToAddress, SplitCancelSwapMapping } from '@app/types';
import { DexTransaction } from '@dex/models/dex-transaction';
import { MetadataKey, TransactionStatus } from '@app/constants';

export class SplitCancelSwapRequest {

    private _dexter: Dexter;
    private _cancelRequests: CancelSwapRequest[] = [];

    constructor(dexter: Dexter) {
        this._dexter = dexter;
    }

    public forTransactions(mappings: SplitCancelSwapMapping[]): SplitCancelSwapRequest {
        this._cancelRequests = mappings.map((mapping: SplitCancelSwapMapping) => {
           return this._dexter.newCancelSwapRequest()
               .forTransaction(mapping.txHash)
               .forDex(mapping.dex);
        });

        return this;
    }

    public submit(): DexTransaction {
        if (! this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a cancel swap order.');
        }
        if (! this._dexter.walletProvider.isWalletLoaded) {
            throw new Error('Wallet must be loaded before submitting a cancel swap order.');
        }
        if (this._cancelRequests.length === 0) {
            throw new Error('Cancel requests were never initialized.');
        }

        const cancelTransaction: DexTransaction = this._dexter.walletProvider.createTransaction();

        Promise.all(this._cancelRequests.map((cancelRequest: CancelSwapRequest) => cancelRequest.getPaymentsToAddresses()))
            .then((payToAddresses: PayToAddress[][]) => {
                this.sendSplitCancelSwapOrder(cancelTransaction, payToAddresses.flat());
            });

        return cancelTransaction;
    }

    private sendSplitCancelSwapOrder(cancelTransaction: DexTransaction, payToAddresses: PayToAddress[]) {
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
