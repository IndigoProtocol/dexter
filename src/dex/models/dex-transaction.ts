import { TransactionStatus } from '@app/constants';
import { BaseWalletProvider } from '@providers/wallet/base-wallet-provider';
import { DexTransactionError, PayToAddress } from '@app/types';

interface TransactionCallback {
    (transaction: DexTransaction): void;
}

export class DexTransaction {

    public providerData: any = {};
    public error: DexTransactionError | undefined = undefined;

    private _hash: string;
    private _isSigned: boolean = false;
    private _payments: PayToAddress[] = [];
    private _walletProvider: BaseWalletProvider;
    private _currentStatus: TransactionStatus = TransactionStatus.Building;
    private _listeners: TransactionCallback[] = [];

    constructor(walletProvider: BaseWalletProvider) {
        this._walletProvider = walletProvider;
    }

    get hash(): string {
        return this._hash;
    }

    get isSigned(): boolean {
        return this._isSigned;
    }

    get payments(): PayToAddress[] {
        return this._payments;
    }

    get status(): TransactionStatus {
        return this._currentStatus;
    }

    set status(status: TransactionStatus) {
        this._currentStatus = status;

        this._listeners.forEach((callback: TransactionCallback) => {
            callback(this);
        });
    }

    public attachMetadata(key: number, json: Object): DexTransaction {
        return this._walletProvider.attachMetadata(this, key, json);
    }

    public payToAddresses(payToAddresses: PayToAddress[]): Promise<DexTransaction> {
        return this._walletProvider.paymentsForTransaction(this, payToAddresses)
            .then(() => {
                this._payments = payToAddresses;

                return this as DexTransaction;
            });
    }

    public sign(): Promise<DexTransaction> {
        if (this._isSigned) {
            throw new Error('Transaction was already signed.');
        }

        return this._walletProvider.signTransaction(this)
            .then(() => {
                this._isSigned = true;

                return this as DexTransaction;
            });
    }

    public submit(): Promise<DexTransaction> {
        if (! this._isSigned) {
            throw new Error('Must sign transaction before submitting.');
        }
        if (this._hash) {
            throw new Error('Transaction was already submitted.');
        }

        return this._walletProvider.submitTransaction(this)
            .then((txHash: string) => {
                this._hash = txHash;

                return this as DexTransaction;
            });
    }

    public onBuilding(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Building) {
                callback(transaction);
            }
        });

        return this;
    }

    public onSigning(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Signing) {
                callback(transaction);
            }
        });

        return this;
    }

    public onSubmitting(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Submitting) {
                callback(transaction);
            }
        });

        return this;
    }

    public onSubmitted(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Submitted) {
                callback(transaction);
            }
        });

        return this;
    }

    public onError(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Errored) {
                callback(transaction);
            }
        });

        return this;
    }

    public onFinally(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Submitted || transaction.status === TransactionStatus.Errored) {
                callback(transaction);
            }
        });

        return this;
    }

    private addListener(callback: TransactionCallback): void {
        this._listeners.push(callback);
    }

}
