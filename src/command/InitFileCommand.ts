import {Command} from "./Command";
import {FileService} from "../file/FileService";
import {Logger} from "../console/Logger";

export class InitFileCommand implements Command {

    constructor(private readonly path: string,
                private readonly fs: FileService,
                private readonly logger: Logger) {}

    execute(): void {
        this.fs.create(this.path);
        this.logger.log(`file ${this.path} created`);
    }

}