export class Log {
    constructor(private list: Array<string>) { }

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

    private clear(): void {
        this.list = [];
    }
}
