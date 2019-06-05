export class Queue {
    constructor(private list: Array<string>) {}

    // Posibility to create list with weights.
    // If user was selected, should be considered as last
    get(): string {
        if (!this.list.length) {
            throw 'no elements in queue';
        }

        let position = this.list.shift();
        this.list.push(position as string);
        
        return position as string;
    }

    size(): number {
        return this.list.length;
    }
}