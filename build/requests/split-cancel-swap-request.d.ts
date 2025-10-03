import { Dexter } from '../dexter.js';
import { SplitCancelSwapMapping } from '../types.js';
import { DexTransaction } from '../dex/models/dex-transaction.js';
export declare class SplitCancelSwapRequest {
    private _dexter;
    private _cancelRequests;
    constructor(dexter: Dexter);
    forTransactions(mappings: SplitCancelSwapMapping[]): SplitCancelSwapRequest;
    submit(): DexTransaction;
    private sendSplitCancelSwapOrder;
}
