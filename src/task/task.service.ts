import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocketGateway } from 'src/socket/socket.gateway';
import { StatusDocument } from 'src/team/schemas/status.schema';
import { StatusService } from 'src/team/status.service';
import { TeamService } from 'src/team/team.service';
import { AddAnswerDTO, ChangeStatusDTO, CreateTaskDTO } from './dto/task.dto';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    private readonly teamService: TeamService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async createTask(dto: CreateTaskDTO) {
    const task = new this.taskModel(dto);
    await task.save();
    await task.populate('status').populate('users').populate('team').execPopulate();
    return task;
  }

  async getTasks(teamId: string): Promise<Array<TaskDocument>> {
    const filter: any = { team: teamId };
    return await this.taskModel.find(filter).populate('status');
  }

  async changeStatus(dto: ChangeStatusDTO): Promise<TaskDocument> {
    const task = await this.taskModel.findById(dto.task);
    await task.updateOne({ status: dto.status });
    task.populate('status');
    this.socketGateway.changedTask(task);
    return task;
  }

  async getTaskById(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }
    return task;
  }

  async takeTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId);
    await this.teamService.checkEnable(task.team.toString(), userId);
    const filter: any = userId;
    if (task.users.find(filter)) {
      throw new HttpException(
        'The user already has this task',
        HttpStatus.BAD_REQUEST,
      );
    }
    task.users.push(filter);
    await task.save();
    this.socketGateway.changedTask(task);
    return task;
  }

  checkUserInTask(task: TaskDocument, userId: string) {
    const filter: any = userId;
    if (!task.users.find(filter)) {
      throw new HttpException(
        'The user do not has this task',
        HttpStatus.BAD_REQUEST,
      );
    }
    return;
  }

  async addAnswer(dto: AddAnswerDTO, userId: string) {
    const task = await this.getTaskById(dto.task);
    this.checkUserInTask(task, userId);
    task.updateOne({ answwer: dto.answer });
    this.socketGateway.changedTask(task);
    return task;
  }

  async getTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId);
    await this.teamService.checkEnable(task.team.toString(), userId);
    return task;
  }
}
