import { DatumParameterKey } from '../../../constants';
import { DatumParameters, DefinitionField } from '../../../types';
declare const _default: {
    constructor: number;
    fields: (((field: DefinitionField, parameters: DatumParameters, shouldExtract?: boolean) => void) | {
        bytes: DatumParameterKey;
        list?: undefined;
        int?: undefined;
    } | {
        list: {
            list: {
                bytes: DatumParameterKey;
            }[];
        }[];
        bytes?: undefined;
        int?: undefined;
    } | {
        int: DatumParameterKey;
        bytes?: undefined;
        list?: undefined;
    })[];
};
export default _default;
