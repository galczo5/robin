import {Member} from "../team/Member";
import {Allocation} from "./Allocation";

export class IOFile {
    public members: Array<Member> = [];
    public companyQueue: any = [];
    public teamQueue: any = {};
    public companyLog: any = {};
    public teamLog: any = {};
    public currentRound: Array<Allocation> = [];
}