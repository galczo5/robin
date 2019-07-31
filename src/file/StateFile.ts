import {Member} from "../team/Member";
import {Assignment} from "./Assignment";

export class StateFile {
    public members: Array<Member> = [];
    public companyQueue: Array<string> = [];
    public teamQueue: {[key:string]:Array<string>} = {};
    public companyLog: {[key:string]:Array<string>} = {};
    public teamLog: {[key:string]:Array<string>} = {};
    public currentRound: Array<Assignment> = [];
}