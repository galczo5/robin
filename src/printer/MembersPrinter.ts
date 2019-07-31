import {Printer} from "./Printer";
import {Member} from "../team/Member";

export abstract class MembersPrinter implements Printer<Array<Member>> {

    abstract print(obj: Array<Member>): void;

}