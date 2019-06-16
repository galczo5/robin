const columnify = require('columnify');
import * as program from 'commander';

import {initTeamQueue} from "./TeamQueue";

import { Robin } from './Robin';
import { Member } from './Member';
import CompanyQueue, {initCompanyQueue} from "./CompanyQueue";
import TeamQueueInstance from './TeamQueue';

import TeamLog from "./TeamLog";
import CompanyLog from "./CompanyLog";

program.option('-i, --input', 'path to input file')
    .option('-o, --output', 'path to output file');

program.command('buddies-list', 'list all users')
    .action(() => { });

program.command('buddies-add [name] [team]', 'add user')
    .action(() => { });

program.command('buddies-modify [name]', 'modify user')
    .action(() => { });

program.command('buddies-remove [name]', 'delete user')
    .action(() => { });

program.command('tick', 'assing new reviewers')
    .action(() => { });

// program.parse(process.argv);

let companyMembers = [
    new Member('AMember', 'ATeam'),
    new Member('BMember', 'ATeam'),
    new Member('CMember', 'ATeam'),
    new Member('DMember', 'BTeam'),
    new Member('EMember', 'BTeam')
];

initTeamQueue(companyMembers);
initCompanyQueue(companyMembers);

let r = new Robin(companyMembers, CompanyQueue, TeamQueueInstance, CompanyLog, TeamLog);

r.round();
console.log(columnify(r.currentRound));
r.round();
console.log(columnify(r.currentRound));
