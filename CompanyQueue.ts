import {SimpleQueue} from "./SimpleQueue";
import {Member} from "./Member";

export class CompanyQueue extends SimpleQueue {

    private static instance: CompanyQueue;

    constructor() {

        if (CompanyQueue.instance) {
            return CompanyQueue.instance;
        }

        super();
        CompanyQueue.instance = this;
    }
}

export function initCompanyQueue(members: Array<Member>) {
    let queue = new CompanyQueue();
    queue.reset(members.map(x => x.name));
}

export default new CompanyQueue();

