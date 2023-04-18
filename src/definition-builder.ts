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

        this.definition = this.applyParameters(this.definition, parameters);

        return this;
    }

    /**
     * Pull parameters of a datum using a definition template.
     */
    public pullParameters(definedDefinition: DefinitionConstr): DatumParameters {
        if (! this.definition) {
            throw new Error(`Please load a definition file before pulling parameters`);
        }

        return this.extractParameters(definedDefinition, this.definition);
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
    private applyParameters(field: DefinitionField, mappedParameters: DatumParameters): DefinitionConstr {
        if ('fields' in field) {
            if (typeof field.constructor === 'string') {
                const parameterValue: any = mappedParameters[field.constructor as keyof typeof DatumParameterKey];

                if (typeof parameterValue !== 'number') {
                    throw new Error(`Invalid parameter value '${parameterValue}' for constructor value`);
                }

                field.constructor = parameterValue;
            }

            field.fields = field.fields.map((fieldParameter: DefinitionField) => {
                return this.applyParameters(fieldParameter, mappedParameters);
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

    /**
     * Recursively pull parameters from datum using definition template.
     */
    private extractParameters(definedDefinition: DefinitionField, templateDefinition: DefinitionField, foundParameters: DatumParameters = {}): DatumParameters {
        if ('fields' in definedDefinition) {
            if (! ('fields' in templateDefinition)) {
                throw new Error("Template definition does not match with 'fields'");
            }

            if (typeof templateDefinition.constructor !== 'number') {
                foundParameters[templateDefinition.constructor] = definedDefinition.constructor;
            }

            definedDefinition.fields.map((fieldParameter: DefinitionField, index: number) => {
                return this.extractParameters(fieldParameter, templateDefinition.fields[index], foundParameters);
            }).forEach((parameters: DatumParameters) => {
                foundParameters = {...foundParameters, ...parameters};
            });
        }

        if ('int' in definedDefinition) {
            if (! ('int' in templateDefinition)) {
                throw new Error("Template definition does not match with 'int'");
            }

            if (typeof templateDefinition.int !== 'number') {
                foundParameters[templateDefinition.int] = definedDefinition.int;
            }
        }

        if ('bytes' in definedDefinition) {
            if (! ('bytes' in templateDefinition)) {
                throw new Error("Template definition does not match with 'bytes'");
            }

            const datumKeys: string[] = Object.values(DatumParameterKey);

            if (datumKeys.includes(templateDefinition.bytes)) {
                foundParameters[templateDefinition.bytes] = definedDefinition.bytes;
            }
        }

        return foundParameters;
    }

}