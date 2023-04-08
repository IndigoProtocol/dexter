import { UTxO } from '../types/provider';

export abstract class BaseProvider {

    abstract async utxos(address: string, asset?: string): Promise<UTxO[]>;

}