const columnify = require('columnify');

import * as program from 'commander';

import { Robin } from './Robin';
import { Member } from './Member';

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

program.command('tick-back', 'remove last assignment')
    .action(() => { });

// program.parse(process.argv);

let r = new Robin([
    new Member('AMember', 'ATeam'),
    new Member('BMember', 'ATeam'),
    new Member('CMember', 'ATeam'),
    new Member('DMember', 'BTeam'),
    new Member('EMember', 'BTeam')
]);

r.round();
console.log(columnify(r.currentRound));
r.round();
console.log(columnify(r.currentRound));
