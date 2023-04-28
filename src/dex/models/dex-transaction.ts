import { TransactionStatus } from '../../constants';

export interface TransactionCallback {
    (x: DexTransaction): void;
}

export class DexTransaction {

    private txStatus: TransactionStatus = TransactionStatus.Building;
    private listeners: TransactionCallback[] = [];

    get status(): TransactionStatus {
        return this.txStatus;
    }

    set status(s: TransactionStatus) {
        this.txStatus = s;

        this.listeners.forEach((c: TransactionCallback) => {
            c(this);
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

    public onBuilt(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Built) {
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

    public onSigned(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Signed) {
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

    public onRetry(callback: TransactionCallback): DexTransaction {
        this.addListener((transaction: DexTransaction) => {
            if (transaction.status === TransactionStatus.Retrying) {
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
        this.listeners.push(callback);
    }

}