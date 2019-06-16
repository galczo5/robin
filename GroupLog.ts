import { Log } from "./Log";

export class GroupLog {

    membersMap: Map<string, Log> = new Map<string, Log>();

    get(memberName: string) {
        if (!this.membersMap.has(memberName)) {
            this.membersMap.set(memberName, new Log([]))
        }

        return this.membersMap.get(memberName);
    }

}
