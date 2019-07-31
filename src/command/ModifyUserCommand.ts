import {Command} from "./Command";
import {FileService} from "../file/FileService";
import {Logger} from "../console/Logger";

export class ModifyUserCommand implements Command {

    constructor(private readonly input: string,
                private readonly output: string,
                private readonly oldName: string,
                private readonly newName: string,
                private readonly team: string,
                private readonly fs: FileService,
                private readonly logger: Logger) {}

    execute(): void {
        let file = this.fs.load(this.input);
        let member = file.members.find(x => x.name === this.oldName);
        member.name = this.newName;

        file.companyQueue = file.companyQueue.map(x => x === this.oldName ? this.newName : x);
        file.teamQueue[member.team] = file.teamQueue[member.team].map(x => x === this.oldName ? this.newName : x);

        // Modify team
        if (this.team) {
            if (this.team in file.teamQueue) {
                file.teamQueue[this.team].push(this.newName);
            }
            else {
                file.teamQueue[this.team] = [this.newName];
            }

            file.teamQueue[member.team] = file.teamQueue[member.team].filter(x => x !== this.newName);
            member.team = this.team;
        }

        // Modify logs
        file.companyLog[this.newName] = file.companyLog[this.oldName];
        file.teamLog[this.newName] = file.teamLog[this.oldName];

        for (let key in file.companyLog) {
            file.companyLog[key] = file.companyLog[key].map(x => x === this.oldName ? this.newName : x);
        }

        for (let key in file.teamLog) {
            file.teamLog[key] = file.teamLog[key].filter(x => x !== this.oldName);
        }

        this.fs.save(this.output, file);
        this.logger.log(`user ${this.oldName} modified`);
    }

}