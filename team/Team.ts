import { Member } from "./Member";

export class Team {

    constructor(public name: string, public members: Array<Member>) {}

    canAcceptReviewer(name: string): boolean {
        return !this.members.find(m => m.name === name);
    }
}