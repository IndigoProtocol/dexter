import { TransactionStatus } from '../../constants';
import { BaseWalletProvider } from '../../providers/wallet/base-wallet-provider';
import { DexTransactionError, PayToAddress } from '../../types';
interface TransactionCallback {
    (transaction: DexTransaction): void;
}
export declare class DexTransaction {
    providerData: any;
    error: DexTransactionError | undefined;
    private _hash;
    private _isSigned;
    private _payments;
    private _walletProvider;
    private _currentStatus;
    private _listeners;
    constructor(walletProvider: BaseWalletProvider);
    get hash(): string;
    get isSigned(): boolean;
    get payments(): PayToAddress[];
    get status(): TransactionStatus;
    set status(status: TransactionStatus);
    attachMetadata(key: number, json: Object): DexTransaction;
    payToAddresses(payToAddresses: PayToAddress[]): Promise<DexTransaction>;
    sign(): Promise<DexTransaction>;
    submit(): Promise<DexTransaction>;
    onBuilding(callback: TransactionCallback): DexTransaction;
    onSigning(callback: TransactionCallback): DexTransaction;
    onSubmitting(callback: TransactionCallback): DexTransaction;
    onSubmitted(callback: TransactionCallback): DexTransaction;
    onError(callback: TransactionCallback): DexTransaction;
    onFinally(callback: TransactionCallback): DexTransaction;
    private addListener;
}
export {};
