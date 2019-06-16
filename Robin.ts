import { Member } from './Member';
import { Team } from './Team';
import { Allocation } from './Allocation';

import { TeamLog } from './TeamLog';
import { CompanyLog } from './CompanyLog';
import { CompanyQueue } from "./CompanyQueue";
import { TeamQueue } from "./TeamQueue";

export class Robin {

    private teams: Array<Team> = [];

    public currentRound: Array<Allocation> = [];

    constructor(private companyMembers: Array<Member>,
                private companyQueue: CompanyQueue,
                private teamQueue: TeamQueue,
                private companyLog: CompanyLog,
                private teamLog: TeamLog) {

        // Split company into teams
        for (let member of companyMembers) {
            let team = this.getTeamByName(member.team);
            if (team) {
                team.members.push(member);
            }
            else {
                this.teams.push(new Team(member.team, [member]));
            }
        }
    }

    round() {
        this.currentRound = [];
        for (let team of this.teams) {
            this.teamRound(team);
        }
    }

    private teamRound(team: Team): void {
        for (let member of team.members) {
            let teamLog = this.teamLog.get(member.name);
            let companyLog = this.companyLog.get(member.name);

            teamLog.checkLog(team.members.length - 1);
            companyLog.checkLog(this.companyQueue.size() - team.members.length);

            let teamReviewer = this.getTeamRevivier(team, member);
            teamLog.addReviever(teamReviewer);

            let companyReviever = this.getCompanyReviewer(team, member);
            companyLog.addReviever(companyReviever);

            this.currentRound.push(new Allocation(member.name, teamReviewer, companyReviever));
        }
    }

    private getTeamRevivier(team: Team, currentMember: Member): string {
        let teamLog = this.teamLog.get(currentMember.name);
        let queue = this.teamQueue.get(team.name);
        let teamReviewer = queue.get();

        while (!teamLog.canAcceptReviewer(teamReviewer) ||
            currentMember.name === teamReviewer) {

            teamReviewer = queue.get();
        }

        return teamReviewer;
    }

    private getCompanyReviewer(team: Team, currentMember: Member): string {
        let companyLog = this.companyLog.get(currentMember.name);
        let companyReviever = this.companyQueue.get();

        while (!companyLog.canAcceptReviewer(companyReviever) ||
            !team.canAcceptReviewer(companyReviever) ||
            currentMember.name === companyReviever) {

            companyReviever = this.companyQueue.get();
        }

        return companyReviever;
    }

    private getTeamByName(name: string): Team {
        return this.teams.find(t => t.name === name);
    }
}
