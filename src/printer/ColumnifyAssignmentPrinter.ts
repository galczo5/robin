import {AssignmentPrinter} from "./AssignmentPrinter";
import {Assignment} from "../file/Assignment";
import {Logger} from "../console/Logger";

const columnify: (obj: any) => string = require('columnify');

export class ColumnifyAssignmentPrinter extends AssignmentPrinter {

    constructor(private readonly logger: Logger) {
        super();
    }

    print(obj: Array<Assignment>): void {
        this.logger.log(columnify(obj))
    }

}