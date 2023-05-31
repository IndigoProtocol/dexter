import { AssetAddress, DefinitionField, Transaction, UTxO } from '@app/types';
import { Asset } from '@dex/models/asset';

export abstract class BaseDataProvider {

    /**
     * Fetch all UTxOs for an address. Will filter on UTxOs containing
     * assetId (concatenation of policy ID & asset name) if provided.
     */
    abstract utxos(address: string, asset?: Asset): Promise<UTxO[]>;

    /**
     * Fetch all UTxOs for a transaction.
     */
    abstract transactionUtxos(txHash: string): Promise<UTxO[]>;

    /**
     * Fetch all transactions containing and asset.
     */
    abstract assetTransactions(asset: Asset): Promise<Transaction[]>;

    /**
     * Fetch all addresses containing an asset.
     */
    abstract assetAddresses(asset: Asset): Promise<AssetAddress[]>

    /**
     * Fetch JSON value of a datum by its hash.
     */
    abstract datumValue(datumHash: string): Promise<DefinitionField>;

}