import { Dexter } from '@app/dexter';
import { DexTransaction } from '@dex/models/dex-transaction';
import { PayToAddress, UTxO } from '@app/types';
import { MetadataKey, TransactionStatus } from '@app/constants';
import { BaseDataProvider } from '@providers/data/base-data-provider';

export class CancelSwapRequest {

    private _dexter: Dexter;
    private _txHash: string;
    private _dexName: string;

    constructor(dexter: Dexter) {
        this._dexter = dexter;
    }

    public forTransaction(txHash: string): CancelSwapRequest {
        this._txHash = txHash;

        return this;
    }

    public forDex(name: string): CancelSwapRequest {
        this._dexName = name;

        return this;
    }

    public getPaymentsToAddresses(): Promise<PayToAddress[]> {
        if (! this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a swap order.');
        }

        const returnAddress: string = this._dexter.walletProvider.address();

        return (this._dexter.dataProvider as BaseDataProvider).transactionUtxos(this._txHash)
            .then((utxos: UTxO[]) => {
                return this._dexter.availableDexs[this._dexName].buildCancelSwapOrder(utxos, returnAddress);
            })
            .catch(() => {
                throw new Error('Unable to grab UTxOs for the provided Tx hash. Ensure the one provided is a valid Tx hash.')
            });
    }

    public cancel(): DexTransaction {
        if (! this._dexter.walletProvider) {
            throw new Error('Wallet provider must be set before submitting a swap order.');
        }
        if (! this._txHash) {
            throw new Error('Tx hash must be provided before cancelling a swap order.');
        }
        if (! this._dexName) {
            throw new Error('DEX must be provided before cancelling a swap order.');
        }

        const cancelTransaction: DexTransaction = this._dexter.walletProvider.createTransaction();

        this.getPaymentsToAddresses()
            .then((payToAddresses: PayToAddress[]) => {
                this.sendCancelOrder(cancelTransaction, payToAddresses);
            })
            .catch((error) => {
                throw new Error(`Unable to cancel swap order. ${error}`)
            });

        return cancelTransaction;
    }

    private sendCancelOrder(cancelTransaction: DexTransaction, payToAddresses: PayToAddress[]) {
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
