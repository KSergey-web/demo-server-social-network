import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocketGateway } from 'src/socket/socket.gateway';
import { TaskService } from 'src/task/task.service';
import {
  AddStatusDTO,
  AddTeamUserLinkDTO,
  CreateTeamDTO,
  DeleteTeamUserLinkDTO,
  UpdateTeamDTO,
} from './dto/team.dto';
import { directionEnum, roleUserTeamEnum } from './enums/role-user.enum';
import { ITeamUserLink } from './interfaces/team.interface';
import { Status, StatusDocument } from './schemas/status.schema';
import { TeamUserLink, TeamUserLinkDocument } from './schemas/team-user.schema';
import { Team, TeamDocument } from './schemas/team.schema';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name)
    private statusModel: Model<StatusDocument>,
    private socketGateway: SocketGateway,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
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
    return await this.statusModel
      .find({ team: teamId, position: { $gt: 0 } }, { team: false })
      .sort({ position: 1 })
      .exec();
  }

  async getStatusById(id: string): Promise<StatusDocument> {
    const status = await this.statusModel.findById(id);
    if (!status) {
      throw new HttpException('Status not found', HttpStatus.BAD_REQUEST);
    }
    return status;
  }

  async getStatusHistory(teamId: string): Promise<Status> {
    const status = await this.statusModel.findOne({
      team: teamId,
      position: -1,
    });
    if (!status) {
      throw new HttpException('Status not found', HttpStatus.BAD_REQUEST);
    }
    return status;
  }

  async checkPosition(teamId: string, position: number) {
    const checkPosition = await this.statusModel.findOne({
      team: teamId,
      position: position,
    });
    if (!checkPosition) {
      throw new HttpException('Position not found', HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async changePositionsToDirectionPlus(
    position: number,
    direction: directionEnum,
  ): Promise<number> {
    if (direction == directionEnum.left) {
      let statuses = await this.statusModel.find({
        position: { $gte: position },
      });
      for (let i = 0; i < statuses.length; ++i) {
        ++statuses[i].position;
        await statuses[i].save();
      }
      return position;
    } else {
      let statuses = await this.statusModel.find({
        position: { $gt: position },
      });
      for (let i = 0; i < statuses.length; ++i) {
        ++statuses[i].position;
        await statuses[i].save();
      }
      return ++position;
    }
  }

  async changePositionsToDirectionRightMin(position: number): Promise<number> {
    let statuses = await this.statusModel.find({ position: { $gt: position } });
    for (let i = 0; i < statuses.length; ++i) {
      --statuses[i].position;
      await statuses[i].save();
    }
    return ++position;
  }

  async addStatus(dto: AddStatusDTO): Promise<Status> {
    await this.checkPosition(dto.team, dto.currentPosition);
    const position = await this.changePositionsToDirectionPlus(
      dto.currentPosition,
      dto.direction,
    );
    const chek = await this.statusModel
      .findOne({ team: dto.team, position })
      .exec();
    if (chek) {
      throw new HttpException(
        'This position already is busy',
        HttpStatus.CONFLICT,
      );
    }
    const status = new this.statusModel({
      position: position,
      team: dto.team,
      name: dto.name,
    });
    await status.save();
    this.socketGateway.addedStatus(status);
    return status;
  }

  async deleteStatus(statusId: string) {
    let status = await this.getStatusById(statusId);
    await this.changePositionsToDirectionRightMin(status.position);
    this.socketGateway.deletedStatus(status.team as string, status._id);
    this.taskService.deleteTasksFromStatus(status);
    await status.deleteOne();
  }
}
