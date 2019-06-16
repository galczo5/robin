import {Queue} from "./Queue";
import {SimpleQueue} from "./SimpleQueue";
import {Member} from "./Member";

export class TeamQueue {

    static instance: TeamQueue;

    teamMap: Map<string, Queue> = new Map<string, Queue>();

    constructor() {
        if (TeamQueue.instance) {
            return TeamQueue.instance;
        }

        TeamQueue.instance = this;
    }

    queueExists(teamName: string): boolean {
        return this.teamMap.has(teamName);
    }

    get(teamName: string): Queue {

        if (!this.teamMap.has(teamName)) {
            throw 'cannot find queue for team ' + teamName;
        }

        return this.teamMap.get(teamName);
    }

    createQueue(teamName: string, members: Array<string>): Queue {
        let queue = new SimpleQueue();
        queue.reset(members);

        this.teamMap.set(teamName, queue);
        return this.teamMap.get(teamName);
    }
}

export function initTeamQueue(members: Array<Member>) {
    let teamQueue = new TeamQueue();
    for (let member of members) {
        if (teamQueue.queueExists(member.team)) {
            let queue = teamQueue.get(member.team);
            queue.add(member.name);
        }
        else {
            teamQueue.createQueue(member.team, [member.name]);
        }
    }
}

export default new TeamQueue();