import {Logger} from "../../src/console/Logger";

export enum LoggerLineType {
    'ERROR',
    'LOG'
}

export class LoggerLine {
    constructor(private readonly line: string,
                private readonly type: LoggerLineType) {}

    getLine(): string {
        return this.line;
    }

    getType(): LoggerLineType {
        return this.type;
    }
}

export class MockedLogger implements Logger {

    private output: Array<LoggerLine> = new Array<LoggerLine>();

    error(obj: string): void {
        this.output.push(new LoggerLine(obj, LoggerLineType.ERROR));
    }

    log(obj: string): void {
        this.output.push(new LoggerLine(obj, LoggerLineType.LOG));
    }

    flush(): void {
        this.output = new Array<LoggerLine>();
    }

    getOutput(): Array<LoggerLine> {
        return this.output;
    }

}