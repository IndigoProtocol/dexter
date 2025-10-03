import { Dexter } from '../dexter.js';
import { DexTransaction } from '../dex/models/dex-transaction.js';
import { PayToAddress } from '../types.js';
export declare class CancelSwapRequest {
    private _dexter;
    private _txHash;
    private _dexName;
    constructor(dexter: Dexter);
    forTransaction(txHash: string): CancelSwapRequest;
    forDex(name: string): CancelSwapRequest;
    getPaymentsToAddresses(): Promise<PayToAddress[]>;
    cancel(): DexTransaction;
    private sendCancelOrder;
}
