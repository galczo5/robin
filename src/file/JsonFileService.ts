import {FileService} from "./FileService";
import {StateFile} from "./StateFile";
import * as fs from "fs";

export class JsonFileService implements FileService {

    load(path: string): StateFile {
        try { return require(path); }
        catch (e) {
            throw new Error('cannot find input file: ' + path);
        }
    }

    save(path: string, file: StateFile): void {
        JsonFileService.savePrettyFile(path, file);
    }

    create(path: string): StateFile {
        let file = new StateFile();
        JsonFileService.savePrettyFile(path, file);
        return file;
    }

    private static savePrettyFile(path: string, file: StateFile) {
        fs.writeFileSync(path, JsonFileService.fileToPrettyJson(file));
    }

    private static fileToPrettyJson(file: StateFile): string {
        return JSON.stringify(file, null, 4);
    }

}