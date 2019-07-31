import {Command} from "./Command";
import {FileService} from "../file/FileService";
import {MembersPrinter} from "../printer/MembersPrinter";

export class ListUsersCommand implements Command {

    constructor(private readonly path: string,
                private readonly fs: FileService,
                private readonly membersPrinter: MembersPrinter) {}

    execute(): void {
        let file = this.fs.load(this.path);

        let members = file.members.sort((a, b) => a.team.localeCompare(b.team));
        this.membersPrinter.print(members);
    }

}