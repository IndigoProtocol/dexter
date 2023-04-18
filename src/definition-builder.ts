import { DatumParameters, DefinitionConstr, DefinitionField } from './types';
import { datumJsonToCbor } from 'lucid-cardano';
import { DatumParameterKey, DEFINITION_ROOT } from './constants';

export class DefinitionBuilder {

    private filePath: string;
    private definition: DefinitionConstr;

    /**
     * Load a DEX definition file as a template for this builder.
     */
    public async loadDefinition(definitionFilePath: string): Promise<DefinitionBuilder> {
        this.filePath = definitionFilePath;

        await import(DEFINITION_ROOT + definitionFilePath)
            .then((definition) => {
                this.definition = definition.default as DefinitionConstr;
            }).catch(() => {
                throw new Error(`Unable to load definition file '${definitionFilePath}'`);
            });

        return this;
    }

    /**
     * Push specified parameters to the definition template.
     */
    public pushParameters(parameters: DatumParameters): DefinitionBuilder {
        if (! this.definition) {
            throw new Error(`Please load a definition file before applying parameters`);
        }

        this.definition = this.applyParameters(parameters, this.definition);

        return this;
    }

    /**
     * Retrieve the CBOR for the builder.
     */
    public getCbor(): string {
        return datumJsonToCbor(
            JSON.parse(
                JSON.stringify(this.definition)
            )
        );
    }

    /**
     * Recursively set specified parameters.
     */
    private applyParameters(mappedParameters: DatumParameters, field: DefinitionField): DefinitionConstr {
        if ('fields' in field) {
            if (typeof field.constructor === 'string') {
                const parameterValue: any = mappedParameters[field.constructor as keyof typeof DatumParameterKey];

                if (typeof parameterValue !== 'number') {
                    throw new Error(`Invalid parameter value '${parameterValue}' for constructor value`);
                }

                field.constructor = parameterValue;
            }

            field.fields = field.fields.map((fieldParameter: DefinitionField) => {
                return this.applyParameters(mappedParameters, fieldParameter);
            });
        }

        if ('int' in field) {
            const parameterValue: any = mappedParameters[field.int as keyof typeof DatumParameterKey];

            if (typeof parameterValue !== 'number') {
                throw new Error(`Invalid parameter value '${parameterValue}' for type 'int'`);
            }

            field.int = parameterValue;
        }

        if ('bytes' in field) {
            const parameterValue: any = mappedParameters[field.bytes as keyof typeof DatumParameterKey];

            if (typeof parameterValue !== 'string') {
                throw new Error(`Invalid parameter value '${parameterValue}' for type 'bytes'`);
            }

            field.bytes = parameterValue;
        }

        return field as DefinitionConstr;
    }

}