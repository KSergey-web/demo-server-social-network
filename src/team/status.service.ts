import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddTeamUserLinkDTO,
  CreateTeamDTO,
  DeleteTeamUserLinkDTO,
  UpdateTeamDTO,
} from './dto/team.dto';
import { roleUserTeamEnum } from './enums/role-user.enum';
import { ITeamUserLink } from './interfaces/team.interface';
import { Status, StatusDocument } from './schemas/status.schema';
import { TeamUserLink, TeamUserLinkDocument } from './schemas/team-user.schema';
import { Team, TeamDocument } from './schemas/team.schema';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name)
    private statusModel: Model<StatusDocument>,
  ) {}

  async initStatuses(team: TeamDocument) {
    const statusesDefault = [
      { name: 'Задачи', position: 1 },
      { name: 'В работе', position: 2 },
      { name: 'Готово', position: 3 },
      { name: 'В истории', position: -1 },
    ];
    statusesDefault.forEach(async (item, i, arr) => {
      const status = new this.statusModel({ ...item, team: team._id });
      await status.save();
    });
  }

  async getStatuses(teamId: string) {
    const filter: any = { team: teamId };
    return await this.statusModel.find({team: teamId, position:{$gt:0} }, { team: false });
  }

  async getStatusById(id: string): Promise<StatusDocument> {
    const status = await this.statusModel.findById(id);
    if (!status) {
      throw new HttpException('Status not found', HttpStatus.BAD_REQUEST);
    }
    return status;
  }
}
