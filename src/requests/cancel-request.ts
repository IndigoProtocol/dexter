import { Dexter } from '../dexter';
import { DexTransaction } from '../dex/models/dex-transaction';
import { PayToAddress, UTxO } from '../types';
import { TransactionStatus } from '../constants';

export class CancelRequest {

    private _dexter: Dexter;
    private _txHash: string;
    private _dexName: string;

    constructor(dexter: Dexter) {
        this._dexter = dexter;
    }

    public forTransaction(txHash: string): CancelRequest {
        this._txHash = txHash;

        return this;
    }

    public forDex(name: string): CancelRequest {
        this._dexName = name;

        return this;
    }

    public cancel(): DexTransaction {
        if (! this._dexter.walletProvider) {
            throw new Error('Please set a wallet provider before submitting a swap order.');
        }
        if (! this._txHash) {
            throw new Error('Tx hash must be provided before cancelling a swap order.');
        }
        if (! this._dexName) {
            throw new Error('DEX must be provided before cancelling a swap order.');
        }

        const cancelTransaction: DexTransaction = this._dexter.walletProvider.createTransaction();
        const returnAddress: string = this._dexter.walletProvider.address();

        this._dexter.dataProvider.transactionUtxos(this._txHash)
            .then((utxos: UTxO[]) => {
                this._dexter.availableDexs[this._dexName].buildCancelSwapOrder(utxos, returnAddress)
                    .then((payToAddresses: PayToAddress[]) => {
                        this.sendCancelOrder(cancelTransaction, payToAddresses);
                    })
                    .catch((error) => {
                        throw new Error(`Unable to cancel swap order. ${error}`)
                    });
            })
            .catch(() => {
                throw new Error('Unable to grab UTxOs for the provided Tx hash. Please check the one provided is a valid Tx hash.')
            });

        return cancelTransaction;
    }

    private sendCancelOrder(cancelTransaction: DexTransaction, payToAddresses: PayToAddress[]) {
        cancelTransaction.status = TransactionStatus.Building;

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
                            });
                    });
            });
    }

}