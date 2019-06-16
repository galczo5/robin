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

export default new CompanyLog();
