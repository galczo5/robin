import {Command} from "./Command";
import {FileService} from "../file/FileService";
import {AssignmentPrinter} from "../printer/AssignmentPrinter";

export class PrintAssignmentCommand implements Command {

    constructor(private readonly input: string,
                private readonly fs: FileService,
                private readonly printer: AssignmentPrinter) {}

    execute(): void {
        let file = this.fs.load(this.input);
        this.printer.print(file.currentRound);
    }

}