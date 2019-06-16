import { GroupLog } from "./GroupLog";

class TeamLog extends GroupLog {
    static instance: TeamLog;

    constructor() {
        if (TeamLog.instance) {
            return TeamLog.instance;
        }

        super();
    }
}

export default new TeamLog();
