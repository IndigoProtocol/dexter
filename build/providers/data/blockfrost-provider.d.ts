import { BaseDataProvider } from './base-data-provider';
import { AssetAddress, BlockfrostConfig, DefinitionField, RequestConfig, Transaction, UTxO } from '../../types';
import { Asset } from '@indigo-labs/iris-sdk';
export declare class BlockfrostProvider extends BaseDataProvider {
    private _api;
    private _requestConfig;
    private _limiter;
    /**
     * https://docs.blockfrost.io/
     */
    constructor(config: BlockfrostConfig, requestConfig?: RequestConfig);
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos/get
     * https://docs.blockfrost.io/#tag/Cardano-Addresses/paths/~1addresses~1%7Baddress%7D~1utxos~1%7Basset%7D/get
     */
    utxos(address: string, asset?: Asset): Promise<UTxO[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Transactions/paths/~1txs~1%7Bhash%7D~1utxos/get
     */
    transactionUtxos(txHash: string): Promise<UTxO[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    assetTransactions(asset: Asset): Promise<Transaction[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Assets/paths/~1assets~1%7Basset%7D~1transactions/get
     */
    assetAddresses(asset: Asset): Promise<AssetAddress[]>;
    /**
     * https://docs.blockfrost.io/#tag/Cardano-Scripts/paths/~1scripts~1datum~1%7Bdatum_hash%7D/get
     */
    datumValue(datumHash: string): Promise<DefinitionField>;
    /**
     * https://docs.blockfrost.io/#section/Concepts
     */
    private sendPaginatedRequest;
}
