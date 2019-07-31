import {Command} from "./Command";
import {initCompanyQueue} from "../queue/CompanyQueue";
import {initTeamQueue} from "../queue/TeamQueue";
import {initCompanyLog} from "../log/CompanyLog";
import {initTeamLog} from "../log/TeamLog";
import {Robin} from "../Robin";
import {FileService} from "../file/FileService";
import {AssignmentPrinter} from "../printer/AssignmentPrinter";

export class AssignReviewersCommand implements Command {

    constructor(private readonly input: string,
                private readonly output: string,
                private readonly fs: FileService,
                private readonly assignmentPrinter: AssignmentPrinter) {}

    execute(): void {
        let file = this.fs.load(this.input);

        let companyQueue = initCompanyQueue(file.members);
        let teamQueue = initTeamQueue(file.teamQueue);

        let companyLog = initCompanyLog(file.companyLog);
        let teamLog = initTeamLog(file.teamLog);

        let r = new Robin(file.members, companyQueue, teamQueue, companyLog, teamLog);

        r.round();

        file.currentRound = r.currentRound;
        file.companyLog = companyLog.toObj();
        file.teamLog = teamLog.toObj();
        file.companyQueue = companyQueue.toArray();
        file.teamLog = teamLog.toObj();

        this.fs.save(this.output, file);
        this.assignmentPrinter.print(r.currentRound);
    }

}