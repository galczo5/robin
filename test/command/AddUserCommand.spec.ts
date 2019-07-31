import {AddUserCommand} from "../../src/command/AddUserCommand";
import {LoggerLineType, MockedLogger} from "../mock/MockedLogger";
import {MockedFileService} from "../mock/MockedFileService";

import {expect} from 'chai';

describe('AddUserCommand', () => {

    const filePath: string = '/input';
    const memberName = 'That other guy';
    const memberTeam = 'The others';

    const logger: MockedLogger = new MockedLogger();
    const fileService: MockedFileService = new MockedFileService();

    beforeEach(() => {
        logger.flush();
        fileService.flush();
        fileService.create(filePath);
    });

    it('adds first user', () => {
        // given & when
        prepareAndExecuteCommand(memberName, memberTeam);

        // then
        let stateFile = fileService.load(filePath);
        expect(stateFile.members).to.be.lengthOf(1);

        let member = stateFile.members[0];
        expect(member.name).to.be.eq(memberName);
        expect(member.team).to.be.eq(memberTeam);

        expect(stateFile.companyQueue).to.contain(memberName);
        expect(stateFile.teamQueue[memberTeam]).to.contain(memberName);
    });

    it('adds next user', () => {
        // given & when
        const secondMember = 'Not that other guy';
        const secondTeam = 'The seconds';
        prepareAndExecuteCommand(memberName, memberTeam);
        prepareAndExecuteCommand(secondMember, secondTeam);

        // then
        let stateFile = fileService.load(filePath);
        expect(stateFile.members).to.be.lengthOf(2);

        let member = stateFile.members[0];
        expect(member.name).to.be.eq(memberName);
        expect(member.team).to.be.eq(memberTeam);

        member = stateFile.members[1];
        expect(member.name).to.be.eq(secondMember);
        expect(member.team).to.be.eq(secondTeam);

        expect(stateFile.companyQueue).to.contain(memberName);
        expect(stateFile.teamQueue[memberTeam]).to.contain(memberName);

        expect(stateFile.companyQueue).to.contain(secondMember);
        expect(stateFile.teamQueue[secondTeam]).to.contain(secondMember);
    });

    it('adds next user to the same team', () => {
        // given & when
        const secondMember = 'Not that other guy';
        prepareAndExecuteCommand(memberName, memberTeam);
        prepareAndExecuteCommand(secondMember, memberTeam);

        // then
        let stateFile = fileService.load(filePath);
        expect(stateFile.members).to.be.lengthOf(2);

        let member = stateFile.members[0];
        expect(member.name).to.be.eq(memberName);
        expect(member.team).to.be.eq(memberTeam);

        member = stateFile.members[1];
        expect(member.name).to.be.eq(secondMember);
        expect(member.team).to.be.eq(memberTeam);

        expect(stateFile.companyQueue).to.contain(memberName);
        expect(stateFile.teamQueue[memberTeam]).to.contain(memberName);

        expect(stateFile.companyQueue).to.contain(secondMember);
        expect(stateFile.teamQueue[memberTeam]).to.contain(secondMember);
    });

    it('prints confirmation', () => {
        // given & when
        prepareAndExecuteCommand(memberName, memberTeam);

        // then
        let log = logger.getOutput();
        expect(log.length).to.be.eq(1);
        expect(log[0].getType()).to.be.eq(LoggerLineType.LOG);
        expect(log[0].getLine()).to.be.eq(`user '${memberName}' added to team '${memberTeam}'`);
    });

    xit('prints error when user name is not unique', () => {
        // TODO: Implement
    });

    function prepareAndExecuteCommand(memberName: string, team: string) {
        let command = new AddUserCommand(filePath, filePath, memberName, team, fileService, logger);
        command.execute();
    }
});