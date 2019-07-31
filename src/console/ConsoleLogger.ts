import {Logger} from "./Logger";

export class ConsoleLogger implements Logger {

    error(obj: string): void {
        console.error(obj);
    }

    log(obj: string): void {
        console.log(obj);
    }

}