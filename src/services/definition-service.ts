import { readFileSync } from 'fs';
import * as path from 'path';
import { Data } from 'lucid-cardano';

export class DefinitionService {

    fromDefinitionFile(filePath: string) {
        import(filePath).then(widget => {
            console.log(Data.fromJson(widget.default))

        });
    }

}