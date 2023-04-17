import { DatumParameters, DefinitionConstr } from './types';
import { datumJsonToCbor } from 'lucid-cardano';

export class DefinitionBuilder {

    private filePath: string;
    private definition: DefinitionConstr;

    async loadDefinition(definitionFilePath: string): Promise<DefinitionBuilder> {
        this.filePath = definitionFilePath;

        await import('./dex/definitions/' + definitionFilePath)
            .then((definition) => {
                this.definition = definition.default as DefinitionConstr;
            }).catch(() => {
                throw new Error(`Unable to load definition file '${definitionFilePath}'`);
            });

        return this;
    }

    applyParameters(parameters: DatumParameters): DefinitionBuilder {
        if (! this.definition) {
            throw new Error(`Please load a definition file before applying parameters`);
        }

        console.log(this.definition.fields[0].constructor)

        return this;
    }

    getCbor(): string {
        return datumJsonToCbor(this.definition);
    }

}

// console.log(datumJsonToCbor((definition.default)))