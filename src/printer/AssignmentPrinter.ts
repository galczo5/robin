import {Printer} from "./Printer";
import {Assignment} from "../file/Assignment";

export abstract class AssignmentPrinter implements Printer<Array<Assignment>> {

    abstract print(obj: Array<Assignment>): void;

}