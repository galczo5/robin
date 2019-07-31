import {Command} from "./Command";
import {Member} from "../team/Member";
import {FileService} from "../file/FileService";
import {Logger} from "../console/Logger";

export class AddUserCommand implements Command {

    constructor(private readonly inputPath: string,
                private readonly outputPath: string,
                private readonly name: string,
                private readonly team: string,
                private readonly fs: FileService,
                private readonly logger: Logger) {}

    execute(): void {
        let file = this.fs.load(this.inputPath);

        file.members.push(new Member(this.name, this.team));
        file.companyQueue.push(this.name);

        if (this.team in file.teamQueue) {
            file.teamQueue[this.team].push(this.name);
        }
        else {
            file.teamQueue[this.team] = [this.name];
        }

        this.fs.save(this.outputPath, file);
        this.logger.log(`user '${this.name}' added to team '${this.team}'`);
    }

}