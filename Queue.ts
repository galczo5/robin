export interface Queue {
    get(): string;
    add(memberName: string): void;
    reset(members: Array<string>): void;
    remove(memberName: string): void;
    size(): number;
    toArray(): Array<string>;
}
