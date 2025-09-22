import { DatumParameterKey } from '../../../constants';
import { DatumParameters, DefinitionField } from '../../../types';
/**
 * https://github.com/minswap/minswap-dex-v2/blob/main/src/types/pool.ts
 */
declare const _default: {
    constructor: number;
    fields: (((field: DefinitionField, parameters: DatumParameters, shouldExtract?: boolean) => void) | {
        constructor: number;
        fields: ((field: DefinitionField, parameters: DatumParameters, shouldExtract?: boolean) => void)[];
        int?: undefined;
    } | {
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
