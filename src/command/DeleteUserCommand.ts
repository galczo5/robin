import {Command} from "./Command";
import {FileService} from "../file/FileService";
import {Logger} from "../console/Logger";

export class DeleteUserCommand implements Command {

    constructor(private readonly input: string,
                private readonly output: string,
                private readonly name: string,
                private readonly fs: FileService,
                private readonly logger: Logger) {}

    execute(): void {
        let file = this.fs.load(this.input);
        let member = file.members.find(x => x.name === this.name);

        file.members = file.members.filter(x => x.name !== this.name);
        file.companyQueue = file.companyQueue.filter(x => x !== this.name);
        file.teamQueue[member.team] = file.teamQueue[member.team].filter(x => x !== this.name);

        for (let user in file.companyLog)
            file.companyLog[user] = file.companyLog[user].filter(x => x !== this.name);

        for (let user in file.teamLog)
                file.teamLog[user] = file.teamLog[user].filter(x => x !== this.name);

        this.fs.save(this.output, file);
        this.logger.log(`user '${this.name}' deleted`);
    }
}