import { DatumParameterKey } from '../../../constants';
/**
 * https://github.com/WingRiders/dex-serializer/blob/main/src/LiquidityPoolDatum.ts
 */
declare const _default: {
    constructor: number;
    fields: ({
        bytes: DatumParameterKey;
        constructor?: undefined;
        fields?: undefined;
    } | {
        constructor: number;
        fields: ({
            constructor: number;
            fields: {
                constructor: number;
                fields: {
                    bytes: DatumParameterKey;
                }[];
            }[];
            int?: undefined;
        } | {
            int: DatumParameterKey;
            constructor?: undefined;
            fields?: undefined;
        })[];
        bytes?: undefined;
    })[];
};
export default _default;
