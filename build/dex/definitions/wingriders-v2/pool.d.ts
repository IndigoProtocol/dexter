import { DatumParameterKey } from '../../../constants.js';
import { DatumParameters, DefinitionField } from '../../../types.js';
declare const _default: {
    constructor: number;
    fields: (((field: DefinitionField, parameters: DatumParameters, shouldExtract?: boolean) => DatumParameters) | {
        bytes: DatumParameterKey;
        int?: undefined;
    } | {
        int: DatumParameterKey;
        bytes?: undefined;
    })[];
};
export default _default;
