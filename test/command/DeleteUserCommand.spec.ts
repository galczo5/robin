import {LoggerLineType, MockedLogger} from "../mock/MockedLogger";
import {MockedFileService} from "../mock/MockedFileService";
import {AddUserCommand} from "../../src/command/AddUserCommand";
import {DeleteUserCommand} from "../../src/command/DeleteUserCommand";

import {expect} from 'chai';
import {StateFile} from "../../src/file/StateFile";
import {Member} from "../../src/team/Member";

describe('DeleteUserCommand', () => {

    const filePath: string = '/input';
    const memberName = 'That other guy';
    const memberTeam = 'The others';
    const logMember = 'Only log guy';

    const logger: MockedLogger = new MockedLogger();
    const fileService: MockedFileService = new MockedFileService();

    beforeEach(() => {
        logger.flush();
        fileService.flush();
        fileService.create(filePath);

        let stateFile = new StateFile();
        stateFile.members = [new Member(memberName, memberTeam)];
        stateFile.companyLog[memberName] = [];
        stateFile.teamLog[memberTeam] = [];
        stateFile.companyQueue = [memberName];
        stateFile.teamQueue[memberTeam] = [memberName];

        stateFile.teamLog[logMember] = [memberName];
        stateFile.companyLog[logMember] = [memberName];

        fileService.save(filePath, stateFile);
    });

    it('deletes user from members list', () => {
        // when
        prepareAndExecuteCommand();

        // then
        let file = fileService.load(filePath);
        let member = file.members.find(m => m.name === memberName);
        expect(member).to.not.exist;
        expect(file.members).to.be.empty;
    });

    it('deletes entries from company queue', () => {
        // when
        prepareAndExecuteCommand();

        // then
        let file = fileService.load(filePath);
        let member = file.companyQueue.find(x => x === memberName);
        expect(member).to.not.exist;
    });

    it('deletes entries from company log', () => {
        // when
        prepareAndExecuteCommand();

        // then
        let file = fileService.load(filePath);
        expect(file.companyLog[logMember]).to.be.empty;
    });

    it('deletes entries team queue', () => {
        // when
        prepareAndExecuteCommand();

        // then
        let file = fileService.load(filePath);
        let member = file.teamQueue[memberTeam].find(x => x === memberName);
        expect(member).to.not.exist;
    });

    it('deletes entries from team log', () => {
        // when
        prepareAndExecuteCommand();

        // then
        let file = fileService.load(filePath);
        expect(file.teamLog[logMember]).to.be.empty;
    });

    it('prints confirmation', () => {
        // when
        prepareAndExecuteCommand();

        // then
        let log = logger.getOutput();
        expect(log.length).to.be.eq(1);
        expect(log[0].getType()).to.be.eq(LoggerLineType.LOG);
        expect(log[0].getLine()).to.be.eq(`user '${memberName}' deleted`);
    });

    xit('prints error when user does not exist', () => {});

    function prepareAndExecuteCommand() {
        new DeleteUserCommand(filePath, filePath, memberName, fileService, logger).execute();
    }
});