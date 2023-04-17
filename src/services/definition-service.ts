import { datumJsonToCbor } from 'lucid-cardano';
import { DatumParameters } from '../types';

export class DefinitionService {

    loadDefinition(definitionFilePath: string, parameters: DatumParameters) {
        import(definitionFilePath).then((definition) => {
            console.log(definition.default)
            // console.log(datumJsonToCbor((definition.default)))l
        });
    }



}