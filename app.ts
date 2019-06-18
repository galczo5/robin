import * as fs from 'fs';
import * as program from 'commander';
const columnify = require('columnify');

import {IOFile} from "./IOFile";
import {Member} from "./Member";
import {Robin} from "./Robin";

import {initCompanyQueue} from "./CompanyQueue";
import {initTeamQueue} from "./TeamQueue";
import {initCompanyLog} from "./CompanyLog";
import {initTeamLog} from "./TeamLog";

program.option('-i, --input <path>', 'path to input file')
    .option('-o, --output <path>', 'path to output file')
    .option('-f, --file', 'path to I/O file');

program.command('init')
    .description('create init file')
    .action(() => {
        initParams();
        saveFile(new IOFile(), program.output);
    });

program.command('buddies-list')
    .description('list all users')
    .action(() => {
        initParams();
        let file = loadFile(program.input);
        print(file.members.sort((a, b) => a.team.localeCompare(b.team)));
    });

program.command('buddies-add [name] [team]')
    .description('add user')
    .action((name, team) => {
        initParams();
        let file = loadFile(program.input);

        // Add to members
        file.members.push(new Member(name, team));

        // Add to company queue
        file.companyQueue.push(name);

        // Add to team queue
        if (team in file.teamQueue) {
            file.teamQueue[team].push(name);
        }
        else {
            file.teamQueue[team] = [name];
        }

        saveFile(file, program.output);
        console.log('user ' + name + ' added');
    });

program.command('buddies-modify <old> <new>')
    .description('modify user')
    .option('-t, --team <team>', 'new team')
    .action((oldName, newName, cmd) => {
        initParams();
        let file = loadFile(program.input);
        let member = file.members.find(x => x.name === oldName);
        member.name = newName;

        file.companyQueue = file.companyQueue.map(x => x === oldName ? newName : x);
        file.teamQueue[member.team] = file.teamQueue[member.team].map(x => x === oldName ? newName : x);

        // Modify team
        if (cmd.team) {
            if (cmd.team in file.teamQueue) {
                file.teamQueue[cmd.team].push(newName);
            }
            else {
                file.teamQueue[cmd.team] = [newName];
            }

            file.teamQueue[member.team] = file.teamQueue[member.team].filter(x => x !== newName);
            member.team = cmd.team;
        }

        // Modify logs
        file.companyLog[newName] = file.companyLog[oldName];
        file.teamLog[newName] = file.teamLog[oldName];

        for (let key in file.companyLog) {
            file.companyLog[key] = file.companyLog[key].map(x => x === oldName ? newName : x);
        }

        for (let key in file.teamLog) {
            file.teamLog[key] = file.teamLog[key].filter(x => x !== oldName);
        }

        saveFile(file, program.output);
    });

program.command('buddies-remove <name>')
    .description('delete user')
    .action((name) => {
        initParams();
        let file = loadFile(program.input);
        let member = file.members.find(x => x.name === name);

        file.members = file.members.filter(x => x.name !== name);
        file.companyQueue = file.companyQueue.filter(x => x !== name);
        file.teamQueue[member.team] = file.teamQueue[member.team].filter(x => x !== name);

        saveFile(file, program.output);
    });

program.command('tick')
    .description('assign new reviewers')
    .action(() => {
        initParams();
        let file = loadFile(program.input);

        let companyQueue = initCompanyQueue(file.members);
        let teamQueue = initTeamQueue(file.teamQueue);

        let companyLog = initCompanyLog(file.companyLog);
        let teamLog = initTeamLog(file.teamLog);

        let r = new Robin(file.members, companyQueue, teamQueue, companyLog, teamLog);

        r.round();

        file.currentRound = r.currentRound;
        file.companyLog = companyLog.toObj();
        file.teamLog = teamLog.toObj();
        file.companyQueue = companyQueue.toArray();
        file.teamLog = teamLog.toObj();

        saveFile(file, program.output);
        print(r.currentRound);
    });

program.command('print')
    .description('print current assignment')
    .action(() => {
        initParams();
        let file = loadFile(program.input);
        print(file.currentRound);
    });

program.command('debug')
    .description('print current assignment as json')
    .action(() => {
        initParams();
        let file = loadFile(program.input);
        console.log(JSON.stringify(file, null, 4));
    });

program.parse(process.argv);

function initParams(): void {
    if (program.file) {
        program.input = program.file;
        program.output = program.file;
    }
}

function loadFile(path: string): IOFile {
    try { return require(path); }
    catch (e) {
        console.warn('cannot find input file: ' + path);
        return new IOFile();
    }
}

function saveFile(file: IOFile, path: string): void {
    fs.writeFileSync(path, JSON.stringify(file, null, 4));
}

function print(obj: any): void {
    console.log(columnify(obj));
}