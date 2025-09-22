import { DatumParameterKey } from '../../../constants';
import { DatumParameters, DefinitionField } from '../../../types';
declare const _default: {
    constructor: number;
    fields: (((field: DefinitionField, parameters: DatumParameters, shouldExtract?: boolean) => void) | {
        constructor: number;
        fields: {
            bytes: DatumParameterKey;
        }[];
        int?: undefined;
    } | {
        int: DatumParameterKey;
        constructor?: undefined;
        fields?: undefined;
    })[];
};
export default _default;
