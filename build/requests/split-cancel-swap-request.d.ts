import { Dexter } from '../dexter';
import { SplitCancelSwapMapping } from '../types';
import { DexTransaction } from '../dex/models/dex-transaction';
export declare class SplitCancelSwapRequest {
    private _dexter;
    private _cancelRequests;
    constructor(dexter: Dexter);
    forTransactions(mappings: SplitCancelSwapMapping[]): SplitCancelSwapRequest;
    submit(): DexTransaction;
    private sendSplitCancelSwapOrder;
}
