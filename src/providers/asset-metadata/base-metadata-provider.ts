import { AssetMetadata } from '@/types';
import { Asset } from '@dex/models/asset';

export abstract class BaseMetadataProvider {

    /**
     * Fetch Asset metadata.
     */
    abstract fetch(assets: Asset[]): Promise<AssetMetadata[]>;

}