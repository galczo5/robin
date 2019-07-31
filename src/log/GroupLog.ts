import { Log } from "./Log";

export class GroupLog {

    membersMap: Map<string, Log> = new Map<string, Log>();

    get(memberName: string) {
        if (!this.membersMap.has(memberName)) {
            this.membersMap.set(memberName, new Log([]))
        }

        return this.membersMap.get(memberName);
    }

    set(name: string, log: Array<string>) {
        this.membersMap.set(name, new Log(log));
    }

    toObj(): { [key:string]:Array<string> } {
        let result = {};

        this.membersMap.forEach((val, key) => {
            result[key] = val.toArray();
        });

        return result;
    }
}
