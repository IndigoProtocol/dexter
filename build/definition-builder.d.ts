import { DatumParameters, DefinitionConstr } from './types';
export declare class DefinitionBuilder {
    private _definition;
    /**
     * Load a DEX definition file as a template for this builder.
     */
    loadDefinition(definition: DefinitionConstr): Promise<DefinitionBuilder>;
    /**
     * Push specified parameters to the definition template.
     */
    pushParameters(parameters: DatumParameters): DefinitionBuilder;
    /**
     * Pull parameters of a datum using a definition template.
     */
    pullParameters(definedDefinition: DefinitionConstr): DatumParameters;
    /**
     * Retrieve the CBOR for the builder.
     */
    getCbor(): string;
    /**
     * Recursively set specified parameters.
     */
    private applyParameters;
    /**
     * Recursively pull parameters from datum using definition template.
     */
    private extractParameters;
}
