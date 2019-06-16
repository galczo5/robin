import { GroupLog } from "./GroupLog";

class CompanyLog extends GroupLog {
    static instance: CompanyLog;

    constructor() {
        if (CompanyLog.instance) {
            return CompanyLog.instance;
        }

        super();
    }
}

export default new CompanyLog();
