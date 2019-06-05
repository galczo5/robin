var columnify = require('columnify')
var fs = require('fs');

import { Member } from './Member';
import { Queue } from './Queue';
import { Team } from './Team';
import { Allocation } from './Allocation';

class Robin {

    private teams: Array<Team> = [];

    private companyQueue: Queue;

    public currentRound: Array<Allocation> = [];

    constructor(private companyMembers: Array<Member>) {

        // Split company into teams
        for(let member of companyMembers) {
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
        this.companyQueue = new Queue(companyMembers.map(m => m.name));
    }

    round() {
        this.currentRound = [];
        for(let team of this.teams) {
            this.teamRound(team);
        }
    }

    private teamRound(team: Team): void {
        for (let member of team.members) {
            member.teamLogCheck(team.members.length);
            member.companyLogCheck(this.companyQueue.size());
            
            let teamReviewer = this.getTeamRevivier(team, member);
            member.addTeamReviever(teamReviewer);

            let companyReviever = this.getCompanyReviewer(team, member);
            member.addCompanyReviewer(companyReviever);

            this.currentRound.push(new Allocation(member.name, teamReviewer, companyReviever));
        }
    }

    private getTeamRevivier(team: Team, currentMember: Member): string {
        let teamReviewer = team.queue.get();
        while (!currentMember.canAcceptReviewer(teamReviewer)) {
            teamReviewer = team.queue.get();
        }

        return teamReviewer;
    }

    private getCompanyReviewer(team: Team, currentMember: Member): string {
        let companyReviever = this.companyQueue.get();
        while (!currentMember.canAcceptReviewer(companyReviever) || !team.canAcceptReviewer(companyReviever)) {
            companyReviever = this.companyQueue.get();
        }

        return companyReviever;
    }

    private getTeamByName(name: string): Team {
        return this.teams.find(t => t.name === name);
    }
}