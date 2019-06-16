export interface Queue {
    get(): string;
    add(memberName: string): void;
    remove(memberName: string): void;
    size(): number;
}
