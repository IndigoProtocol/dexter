import { TransactionStatus } from '../../constants';
import { WalletProvider } from '../../wallet-provider/wallet-provider';
import { DexTransactionError, PayToAddress } from '../../types';

interface TransactionCallback {
    (transaction: DexTransaction): void;
}

export class DexTransaction {

    public hash: string;
    public providerData: any;
    public error: DexTransactionError | undefined = undefined;

    private walletProvider: WalletProvider;
    private isSigned: boolean = false;
    private currentStatus: TransactionStatus = TransactionStatus.Building;
    private listeners: TransactionCallback[] = [];

    constructor(walletProvider: WalletProvider) {
        this.walletProvider = walletProvider;
    }

    get status(): TransactionStatus {
        return this.currentStatus;
    }

    set status(status: TransactionStatus) {
        this.currentStatus = status;

        this.listeners.forEach((callback: TransactionCallback) => {
            callback(this);
        });
    }

    public payToAddresses(payToAddresses: PayToAddress[]): Promise<DexTransaction> {
        return this.walletProvider.paymentsForTransaction(this, payToAddresses)
            .then(() => this as DexTransaction);
    }

    public sign(): Promise<DexTransaction> {
        return this.walletProvider.signTransaction(this)
            .then(() => {
                this.isSigned = true;

                return this as DexTransaction;
            });
    }

    public submit(): Promise<DexTransaction> {
        if (this.isSigned) {
            throw new Error('Must sign transactions before submitting.');
        }

        return this.walletProvider.submitTransaction(this)
            .then((txHash: string) => {
                this.hash = txHash;

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