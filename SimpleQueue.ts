import { Queue } from "./Queue";

export class SimpleQueue implements Queue {

    private list: Array<string> = [];

    constructor() { }

    get(): string {
        if (!this.list.length) {
            throw 'no elements in queue';
        }

        let position = this.list.shift();
        this.list.push(position as string);

        return position as string;
    }

    add(memberName: string): void {
        this.list.push(memberName);
    }

    reset(members: Array<string>): void {
        this.list = members;
    }

    remove(memberName: string): void {
        this.list = this.list.filter(x => x !== memberName);
    }

    size(): number {
        return this.list.length;
    }
}
