import { BaseProvider } from './base-provider';
import { BlockfrostConfig } from '../types/global';

export class Blockfrost extends BaseProvider {

    config: BlockfrostConfig;

    constructor(config: BlockfrostConfig) {
        super();

        this.config = config;
    }

}