import { DatumParameterKey } from '../../../constants';
/**
 * https://github.com/minswap/minswap-dex-v2/blob/main/src/types/order.ts
 */
declare const _default: {
    constructor: number;
    fields: ({
        constructor: number;
        fields: {
            bytes: DatumParameterKey;
        }[];
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
                fields: {
                    constructor: number;
                    fields: {
                        bytes: DatumParameterKey;
                    }[];
                }[];
            }[];
        })[];
        int?: undefined;
    } | {
        constructor: number;
        fields: ({
            constructor: DatumParameterKey;
            fields: never[];
            int?: undefined;
        } | {
            constructor: number;
            fields: {
                int: DatumParameterKey;
            }[];
            int?: undefined;
        } | {
            int: DatumParameterKey;
            constructor?: undefined;
            fields?: undefined;
        })[];
        int?: undefined;
    } | {
        int: DatumParameterKey;
        constructor?: undefined;
        fields?: undefined;
    })[];
};
export default _default;
