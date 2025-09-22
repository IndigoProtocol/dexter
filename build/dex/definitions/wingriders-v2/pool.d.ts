import { DatumParameterKey } from '../../../constants';
import { DatumParameters, DefinitionField } from '../../../types';
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
