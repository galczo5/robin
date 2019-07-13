export class Log {
    constructor(protected list: Array<string>) { }

    canAcceptReviewer(name: string): boolean {
        return !this.list.find(x => x === name);
    }

    checkLog(lenght: number) {
        if (this.list.length >= lenght) {
            this.clear();
        }
    }

    addReviever(name: string): void {
        this.list.push(name);
    }

    reset(list: Array<string>) {
        this.list = list;
    }

    toArray(): Array<string> {
        return this.list;
    }

    private clear(): void {
        this.list = [];
    }
}
