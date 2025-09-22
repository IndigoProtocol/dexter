import { Dexter } from '../dexter';
import { DexTransaction } from '../dex/models/dex-transaction';
import { PayToAddress } from '../types';
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
