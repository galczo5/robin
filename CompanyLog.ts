import { GroupLog } from "./GroupLog";

export class CompanyLog extends GroupLog {
    static instance: CompanyLog;

    constructor() {
        if (CompanyLog.instance) {
            return CompanyLog.instance;
        }

        super();
        CompanyLog.instance = this;
    }
}

export function initCompanyLog(map: { [key:string]:Array<string> }): CompanyLog {
    let log = new CompanyLog();
    for (let key in map) {
        log.set(key, map[key]);
    }

    return log;
}

export default new CompanyLog();
