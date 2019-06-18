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

export function initTeamLog(map: { [key:string]:Array<string> }): TeamLog {
    let log = new TeamLog();
    for (let key in map) {
        log.set(key, map[key]);
    }

    return log;
}

export default new TeamLog();
