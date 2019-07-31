import {MembersPrinter} from "./MembersPrinter";
import {Member} from "../team/Member";
import {Logger} from "../console/Logger";

const columnify: (obj: any) => string = require('columnify');

export class ColumnifyMembersPrinter extends MembersPrinter {

    constructor(private readonly logger: Logger) {
        super();
    }

    print(obj: Array<Member>): void {
        this.logger.log(columnify(obj))
    }

}