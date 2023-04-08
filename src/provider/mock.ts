import { BaseProvider } from './base-provider';
import { UTxO } from '../types/provider';

export class Mock extends BaseProvider {

    async utxos(address: string, asset?: string): Promise<UTxO[]> {
    }

}