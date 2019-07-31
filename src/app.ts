import * as program from 'commander';

import {FileService} from "./file/FileService";
import {JsonFileService} from "./file/JsonFileService";
import {InitFileCommand} from "./command/InitFileCommand";
import {ListUsersCommand} from "./command/ListUsersCommand";
import {AddUserCommand} from "./command/AddUserCommand";
import {ModifyUserCommand} from "./command/ModifyUserCommand";
import {DeleteUserCommand} from "./command/DeleteUserCommand";
import {AssignReviewersCommand} from "./command/AssignReviewersCommand";
import {PrintAssignmentCommand} from "./command/PrintAssignmentCommand";
import {MembersPrinter} from "./printer/MembersPrinter";
import {ColumnifyMembersPrinter} from "./printer/ColumnifyMembersPrinter";
import {Logger} from "./console/Logger";
import {ConsoleLogger} from "./console/ConsoleLogger";
import {AssignmentPrinter} from "./printer/AssignmentPrinter";
import {ColumnifyAssignmentPrinter} from "./printer/ColumnifyAssignmentPrinter";

let jsonFS: FileService = new JsonFileService();
let consoleLogger: Logger = new ConsoleLogger();
let membersPrinter: MembersPrinter = new ColumnifyMembersPrinter(consoleLogger);
let assignmentPrinter: AssignmentPrinter = new ColumnifyAssignmentPrinter(consoleLogger);

program.option('-i, --input [path]', 'path to input file')
    .option('-o, --output [path]', 'path to output file')
    .option('-f, --file', 'path to I/O file');

program.command('init')
    .description('create init file')
    .action(() => {
        let command = new InitFileCommand(program.output, jsonFS, consoleLogger);
        command.execute();
    });

program.command('buddies-list')
    .description('list all users')
    .action(() => {
        let command = new ListUsersCommand(program.input, jsonFS, membersPrinter);
        command.execute();
    });

program.command('buddies-add [name] [team]')
    .description('add user')
    .action((name, team) => {
        let command = new AddUserCommand(program.input, program.output, name, team, jsonFS, consoleLogger);
        command.execute();
    });

program.command('buddies-modify <old> <new>')
    .description('modify user')
    .option('-t, --team <team>', 'new team')
    .action((oldName, newName, cmd) => {
        let command = new ModifyUserCommand(program.input, program.output, oldName, newName, cmd.team, jsonFS, consoleLogger);
        command.execute();
    });

program.command('buddies-remove <name>')
    .description('delete user')
    .action((name: string) => {
        let command = new DeleteUserCommand(program.input, program.output, name, jsonFS, consoleLogger);
        command.execute();
    });

program.command('tick')
    .description('assign new reviewers')
    .action(() => {
        let command = new AssignReviewersCommand(program.input, program.output, jsonFS, assignmentPrinter);
        command.execute();
    });

program.command('print')
    .description('print current assignment')
    .action(() => {
        let command = new PrintAssignmentCommand(program.input, jsonFS, assignmentPrinter);
        command.execute();
    });

program.parse(process.argv);