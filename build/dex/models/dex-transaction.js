import { TransactionStatus } from '../../constants';
export class DexTransaction {
    constructor(walletProvider) {
        this.providerData = {};
        this.error = undefined;
        this._isSigned = false;
        this._payments = [];
        this._currentStatus = TransactionStatus.Building;
        this._listeners = [];
        this._walletProvider = walletProvider;
    }
    get hash() {
        return this._hash;
    }
    get isSigned() {
        return this._isSigned;
    }
    get payments() {
        return this._payments;
    }
    get status() {
        return this._currentStatus;
    }
    set status(status) {
        this._currentStatus = status;
        this._listeners.forEach((callback) => {
            callback(this);
        });
    }
    attachMetadata(key, json) {
        return this._walletProvider.attachMetadata(this, key, json);
    }
    payToAddresses(payToAddresses) {
        return this._walletProvider.paymentsForTransaction(this, payToAddresses)
            .then(() => {
            this._payments = payToAddresses;
            return this;
        });
    }
    sign() {
        if (this._isSigned) {
            throw new Error('Transaction was already signed.');
        }
        return this._walletProvider.signTransaction(this)
            .then(() => {
            this._isSigned = true;
            return this;
        });
    }
    submit() {
        if (!this._isSigned) {
            throw new Error('Must sign transaction before submitting.');
        }
        if (this._hash) {
            throw new Error('Transaction was already submitted.');
        }
        return this._walletProvider.submitTransaction(this)
            .then((txHash) => {
            this._hash = txHash;
            return this;
        });
    }
    onBuilding(callback) {
        this.addListener((transaction) => {
            if (transaction.status === TransactionStatus.Building) {
                callback(transaction);
            }
        });
        return this;
    }
    onSigning(callback) {
        this.addListener((transaction) => {
            if (transaction.status === TransactionStatus.Signing) {
                callback(transaction);
            }
        });
        return this;
    }
    onSubmitting(callback) {
        this.addListener((transaction) => {
            if (transaction.status === TransactionStatus.Submitting) {
                callback(transaction);
            }
        });
        return this;
    }
    onSubmitted(callback) {
        this.addListener((transaction) => {
            if (transaction.status === TransactionStatus.Submitted) {
                callback(transaction);
            }
        });
        return this;
    }
    onError(callback) {
        this.addListener((transaction) => {
            if (transaction.status === TransactionStatus.Errored) {
                callback(transaction);
            }
        });
        return this;
    }
    onFinally(callback) {
        this.addListener((transaction) => {
            if (transaction.status === TransactionStatus.Submitted || transaction.status === TransactionStatus.Errored) {
                callback(transaction);
            }
        });
        return this;
    }
    addListener(callback) {
        this._listeners.push(callback);
    }
}
