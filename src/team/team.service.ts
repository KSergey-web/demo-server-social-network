import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { OrganizationService } from 'src/organization/organization.service';
import { User } from 'src/user/schemas/user.schema';
import {
  AddStatusDTO,
  AddTeamUserLinkDTO,
  CreateTeamDTO,
  DeleteStatusDTO,
  DeleteTeamUserLinkDTO,
  UpdateTeamDTO,
} from './dto/team.dto';
import { roleUserTeamEnum } from './enums/role-user.enum';
import { ITeamUserLink } from './interfaces/team.interface';
import { Status, StatusDocument } from './schemas/status.schema';
import { TeamUserLink, TeamUserLinkDocument } from './schemas/team-user.schema';
import { Team, TeamDocument } from './schemas/team.schema';
import { StatusService } from './status.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument>,
    @InjectModel(TeamUserLink.name)
    private teamUserLinkModel: Model<TeamUserLinkDocument>,
    private readonly statusService: StatusService,
    private readonly organizationService: OrganizationService,
  ) {}

  async createTeam(createTeamDTO: CreateTeamDTO, userId: string) {
    const team = new this.teamModel({
      ...createTeamDTO,
      organization: createTeamDTO.organization,
    });
    await team.save();
    await this.statusService.initStatuses(team);
    const teamUserLink: ITeamUserLink = {
      roleUser: roleUserTeamEnum.admin,
      team: team._id,
      user: userId,
    };
    const link = new this.teamUserLinkModel(teamUserLink);
    await link.save();
    if (createTeamDTO.users) {
      createTeamDTO.users.forEach(async user => {
        await this.addTeamUserLink({ team: team._id, user }, userId);
      });
    }
    return team;
  }

  async getTeams(organizationId: string, userId: string): Promise<Array<Team>> {
    const links = await this.teamUserLinkModel
      .find({ user: userId })
      .populate('team')
      .exec();
    let teams: Array<Team> = [];
    links.forEach(({ team }) => {
      if ((team as Team).organization == organizationId) {
        teams.push(team as Team);
      }
    });
    return teams;
  }

  async getTeamById(id: string): Promise<TeamDocument> {
    const team = await this.teamModel.findById(id);
    if (!team) {
      throw new HttpException('Team not found', HttpStatus.BAD_REQUEST);
    }
    return team;
  }

  async teamUserLink(
    teamId: string,
    userId: string,
  ): Promise<TeamUserLinkDocument> {
    const obj: ITeamUserLink = {
      user: userId,
      team: teamId,
    };
    const link = await this.teamUserLinkModel.findOne(obj);
    if (!link) {
      throw new HttpException(
        'You do not have this team',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async checkAccess(
    link: TeamUserLinkDocument,
    ...roles: Array<roleUserTeamEnum>
  ): Promise<TeamUserLinkDocument> {
    let access: boolean = false;
    let rolestr: string;
    roles.forEach(function(item, i, arr) {
      if (item == link.roleUser) {
        access = true;
      }
      rolestr += item + '/';
    });
    if (!access) {
      throw new HttpException(
        `You are not ${rolestr} in this team`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async updateTeam(
    updateTeamDTO: UpdateTeamDTO,
    teamId: string,
    userId: string,
  ) {
    const team = await this.getTeamById(teamId);
    const link = await this.teamUserLink(teamId, userId);
    await this.checkAccess(link, roleUserTeamEnum.admin);
    return await team.updateOne(updateTeamDTO);
  }

  async deleteTeam(teamId: string, userId: string): Promise<string> {
    const team = await this.getTeamById(teamId);
    const link = await this.teamUserLink(teamId, userId);
    await this.checkAccess(link, roleUserTeamEnum.admin);
    await team.deleteOne();
    await this.teamUserLinkModel.deleteMany({
      team: team._id,
    });
    return 'Team deleted';
  }

  async addTeamUserLink(
    dto: AddTeamUserLinkDTO,
    userId: string,
  ): Promise<User> {
    const team = await this.getTeamById(dto.team);
    await this.organizationService.organizationUserLink(
      team.organization as string,
      userId,
    );
    const link = await this.teamUserLink(dto.team, userId);
    await this.checkAccess(link, roleUserTeamEnum.admin);
    const newLink = new this.teamUserLinkModel(dto);
    await newLink.save();
    await newLink.populate('user').execPopulate();
    return newLink.user as User;
  }

  async deleteTeamUserLink(
    dto: DeleteTeamUserLinkDTO,
    userId: string,
  ): Promise<string> {
    await this.getTeamById(dto.team);
    const link = await this.teamUserLink(dto.team, userId);
    await this.checkAccess(link, roleUserTeamEnum.admin);
    const filter: any = dto;
    const check = await this.teamUserLinkModel.deleteOne(filter);
    if (check.n != 1)
      throw new HttpException(
        'Team member is not found',
        HttpStatus.BAD_REQUEST,
      );
    return 'Team member deleted';
  }

  async getStatuses(teamId: string, userId: string) {
    await this.getTeamById(teamId);
    await this.teamUserLink(teamId, userId);
    return this.statusService.getStatuses(teamId);
  }

  async checkEnable(
    teamId: string,
    userId: string,
    ...roles: Array<roleUserTeamEnum>
  ) {
    await this.getTeamById(teamId);
    const link = await this.teamUserLink(teamId, userId);
    if (roles.length != 0) {
      await this.checkAccess(link, ...roles);
    }
    return;
  }

  async getUsers(teamId: string, userId: string): Promise<Array<User>> {
    await this.checkEnable(teamId, userId);
    let links = await this.teamUserLinkModel
      .find({ team: teamId })
      .populate('user')
      .exec();
    return links.map((item): User => item.user as User);
  }

  async addStatus(dto: AddStatusDTO, userId: string): Promise<Status>{
    await this.checkEnable(dto.team, userId, roleUserTeamEnum.admin);
    return await this.statusService.addStatus(dto);
  }

  async deleteStatus(dto: DeleteStatusDTO, userId: string) {
    await this.checkEnable(dto.team, userId, roleUserTeamEnum.admin);
    return await this.statusService.deleteStatus(dto.status);
  }
}
