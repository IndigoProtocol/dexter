import { DatumParameterKey } from '../../../constants';
import { DatumParameters, DefinitionField } from '../../../types';
declare const _default: {
    constructor: number;
    fields: ({
        bytes: DatumParameterKey;
        constructor?: undefined;
        fields?: undefined;
        int?: undefined;
    } | {
        constructor: number;
        fields: {
            bytes: DatumParameterKey;
        }[];
        bytes?: undefined;
        int?: undefined;
    } | {
        int: DatumParameterKey;
        bytes?: undefined;
        constructor?: undefined;
        fields?: undefined;
    } | {
        constructor: number;
        fields: {
            int: DatumParameterKey;
        }[];
        bytes?: undefined;
        int?: undefined;
    } | {
        constructor: number;
        fields: ({
            constructor: number;
            fields: {
                bytes: DatumParameterKey;
            }[];
        } | {
            constructor: number;
            fields: {
                constructor: number;
                fields: ((field: DefinitionField, parameters: DatumParameters, shouldExtract?: boolean) => {
                    constructor: number;
                    fields: {
                        bytes: string;
                    }[];
                } | undefined)[];
            }[];
        })[];
        bytes?: undefined;
        int?: undefined;
    } | {
        bytes: DatumParameterKey;
    }[])[];
};
export default _default;
