import { Transaction, UTxO } from '../types/provider';

export abstract class BaseProvider {

    /**
     * Fetch all UTxOs for an address. Will filter on UTxOs containing
     * assetId (concatenation of policy ID & asset name) if provided.
     */
    abstract async utxos(address: string, assetId?: string): Promise<UTxO[]>;

    /**
     * Fetch all UTxOs for a transaction.
     */
    abstract async transactionUtxos(txHash: string): Promise<UTxO[]>;

    /**
     * Fetch all transactions containing and asset.
     */
    abstract async assetTransactions(assetId: string): Promise<Transaction[]>;

}