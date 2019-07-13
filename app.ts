import * as fs from 'fs';
import * as program from 'commander';
const columnify = require('columnify');

import {IOFile} from "./file/IOFile";
import {Member} from "./team/Member";
import {Robin} from "./Robin";

import {initCompanyQueue} from "./queue/CompanyQueue";
import {initTeamQueue} from "./queue/TeamQueue";
import {initCompanyLog} from "./log/CompanyLog";
import {initTeamLog} from "./log/TeamLog";

program.option('-i, --input <path>', 'path to input file')
    .option('-o, --output <path>', 'path to output file')
    .option('-f, --file', 'path to I/O file');

program.command('init')
    .description('create init file')
    .action(() => initFile());

program.command('buddies-list')
    .description('list all users')
    .action(() => {
        listUsers();
    });

program.command('buddies-add [name] [team]')
    .description('add user')
    .action((name, team) => addUser(name, team));

program.command('buddies-modify <old> <new>')
    .description('modify user')
    .option('-t, --team <team>', 'new team')
    .action((oldName, newName, cmd) => modifyUser(oldName, newName, cmd));

program.command('buddies-remove <name>')
    .description('delete user')
    .action((name: string) => deleteMember(name));

program.command('tick')
    .description('assign new reviewers')
    .action(() => tick());

program.command('print')
    .description('print current assignment')
    .action(() => {
        printCurrentAssignment();
    });

program.command('debug')
    .description('print current assignment as json')
    .action(() => {
        printInputFile();
    });

program.parse(process.argv);

function initFile(): void {
    initParams();
    saveFile(new IOFile(), program.output);
}

function listUsers() {
    initParams();
    let file = loadFile(program.input);
    print(file.members.sort((a, b) => a.team.localeCompare(b.team)));
}

function addUser(name: string, team: string) {
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
}

function modifyUser(oldName: string, newName: string, cmd: { team: string }): void {
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
}

function deleteMember(name: string): void {
    initParams();
    let file = loadFile(program.input);
    let member = file.members.find(x => x.name === name);

    file.members = file.members.filter(x => x.name !== name);
    file.companyQueue = file.companyQueue.filter(x => x !== name);
    file.teamQueue[member.team] = file.teamQueue[member.team].filter(x => x !== name);

    saveFile(file, program.output);
}

function tick(): void {
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
}

function printCurrentAssignment() {
    initParams();
    let file = loadFile(program.input);
    print(file.currentRound);
}

function printInputFile(): void {
    initParams();
    let file = loadFile(program.input);
    console.log(JSON.stringify(file, null, 4));
}

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