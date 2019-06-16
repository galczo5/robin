import { Queue } from "./Queue";
import { Member } from "./Member";
import { SimpleQueue } from "./SimpleQueue";

export class Team { 

    public queue: Queue;

    constructor(public name: string, public members: Array<Member>) {}

    initQueue(): void {
        this.queue = new SimpleQueue(this.members.map(m => m.name));
    }

    canAcceptReviewer(name: string): boolean {
        return !this.members.find(m => m.name === name);
    }
}