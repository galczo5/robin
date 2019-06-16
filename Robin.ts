import { Member } from './Member';
import { Queue } from './Queue';
import { Team } from './Team';
import { Allocation } from './Allocation';

import TeamLog from './TeamLog';
import CompanyLog from './CompanyLog';
import { SimpleQueue } from './SimpleQueue';

export class Robin {

    private teams: Array<Team> = [];

    private companyQueue: Queue;

    public currentRound: Array<Allocation> = [];

    constructor(private companyMembers: Array<Member>) {

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

        // Init queue for each team
        this.teams.forEach(t => t.initQueue());
        this.companyQueue = new SimpleQueue(companyMembers.map(m => m.name));
    }

    round() {
        this.currentRound = [];
        for (let team of this.teams) {
            this.teamRound(team);
        }
    }

    private teamRound(team: Team): void {
        for (let member of team.members) {

            let teamLog = TeamLog.get(member.name);
            let companyLog = CompanyLog.get(member.name);

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
        let teamLog = TeamLog.get(currentMember.name);
        let teamReviewer = team.queue.get();
        while (!teamLog.canAcceptReviewer(teamReviewer) ||
            currentMember.name === teamReviewer) {

            teamReviewer = team.queue.get();
        }

        return teamReviewer;
    }

    private getCompanyReviewer(team: Team, currentMember: Member): string {
        let companyLog = CompanyLog.get(currentMember.name);
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
