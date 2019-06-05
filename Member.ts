export class Member {
    constructor(public name: string, 
                public team: string,
                private teamLog: Array<string> = [],
                private companyLog: Array<string> = []) {
    }

    teamLogCheck(lenght: number) {
        if (this.teamLog.length === lenght - 1) {
            this.clearTeamLog();
        }
    }

    companyLogCheck(lenght: number) {
        if (this.companyLog.length === lenght - 1) {
            this.clearCompanyLog();
        }
    }

    canAcceptReviewer(name: string): boolean {
        return name !== this.name && 
                !this.teamLog.find(x => x === name) && 
                !this.companyLog.find(x => x === name);
    }

    addTeamReviever(name: string): void {
        this.teamLog.push(name);
    }

    addCompanyReviewer(name: string): void {
        this.companyLog.push(name);
    }

    private clearTeamLog(): void {
        this.teamLog = [];
    }

    private clearCompanyLog(): void {
        this.companyLog = [];
    }
}