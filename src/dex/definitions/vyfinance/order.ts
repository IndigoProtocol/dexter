import { DatumParameterKey } from '@app/constants.js';

export default {
  constructor: 0,
  fields: [
    {
      bytes: DatumParameterKey.SenderKeyHashes
    },
    {
      constructor: DatumParameterKey.Action,
      fields: [
        {
          int: DatumParameterKey.MinReceive
        }
      ]
    }
  ]
};