import {StateFile} from "./StateFile";

export interface FileService {
    load(path: string): StateFile;
    save(path: string, file: StateFile): void;
    create(path: string): StateFile;
}