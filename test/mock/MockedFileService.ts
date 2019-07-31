import {FileService} from "../../src/file/FileService";
import {StateFile} from "../../src/file/StateFile";

export class MockedFileService implements FileService {

    private map: Map<string, StateFile> = new Map<string, StateFile>();

    create(path: string): StateFile {
        let stateFile = new StateFile();
        this.map.set(path, stateFile);
        return stateFile;
    }

    load(path: string): StateFile {
        return this.map.get(path);
    }

    save(path: string, file: StateFile): void {
        this.map.set(path, file);
    }

    flush(): void {
        this.map = new Map<string, StateFile>();
    }

}