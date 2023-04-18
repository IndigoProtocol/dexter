import { DatumParameters, DefinitionConstr, DefinitionField } from './types';
import { datumJsonToCbor } from 'lucid-cardano';

export class DefinitionBuilder {

    private filePath: string;
    private definition: DefinitionConstr;

    public async loadDefinition(definitionFilePath: string): Promise<DefinitionBuilder> {
        this.filePath = definitionFilePath;

        await import('./dex/definitions/' + definitionFilePath)
            .then((definition) => {
                this.definition = definition.default as DefinitionConstr;
            }).catch(() => {
                throw new Error(`Unable to load definition file '${definitionFilePath}'`);
            });

        return this;
    }

    public applyParameters(parameters: DatumParameters): DefinitionBuilder {
        if (! this.definition) {
            throw new Error(`Please load a definition file before applying parameters`);
        }

        this.definition = this.pushParameters(parameters, this.definition);

        return this;
    }

    public getCbor(): string {
        return datumJsonToCbor(this.definition);
    }

    private pushParameters(mappedParameters: DatumParameters, field: DefinitionField): DefinitionConstr {
        if ('fields' in field) {
            field.fields = field.fields.map((fieldParameter: DefinitionField) => {
                return this.pushParameters(mappedParameters, fieldParameter);
            });
        }

        if ('int' in field) {
            field.int = mappedParameters[field.int];
        }

        if ('bytes' in field) {
            field.bytes = mappedParameters[field.bytes];
        }

        return field as DefinitionConstr;
    }

}