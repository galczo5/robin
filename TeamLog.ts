import { GroupLog } from "./GroupLog";

export class TeamLog extends GroupLog {
    static instance: TeamLog;

    constructor() {
        if (TeamLog.instance) {
            return TeamLog.instance;
        }

        super();
        TeamLog.instance = this;
    }
}

export default new TeamLog();
