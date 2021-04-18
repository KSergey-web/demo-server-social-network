import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { SocketGateway } from 'src/socket/socket.gateway';
import { roleUserTeamEnum } from 'src/team/enums/role-user.enum';
import { StatusDocument } from 'src/team/schemas/status.schema';
import { StatusService } from 'src/team/status.service';
import { TeamService } from 'src/team/team.service';
import { AddAnswerDTO, AddUserToTaskDTO, ChangeStatusDTO, CreateTaskDTO, UpdateTaskDTO } from './dto/task.dto';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    private readonly teamService: TeamService,
    private readonly socketGateway: SocketGateway,
    private readonly statusService: StatusService
  ) {}

  async createTask(dto: CreateTaskDTO) {

    const task = new this.taskModel(dto);
    await task.save();
    await task.populate('status').populate('users').populate('team').execPopulate();
    return task;

  }

  async getTasks(teamId: string): Promise<Array<TaskDocument>> {
    const filter: any = { team: teamId };
    return await this.taskModel.find(filter).populate('status').populate('users').exec();
  }

  async changeStatus(dto: ChangeStatusDTO, teamId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(dto.task);
    if (task.team.toString() != teamId){
        throw new HttpException('This Task is not belong this team', HttpStatus.BAD_REQUEST);
    }
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

  async updateTask(
    taskId:string,
    dto: UpdateTaskDTO,
    userId: string,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
    this.teamService.checkEnable(task.team as string,userId,roleUserTeamEnum.admin);
     await task.updateOne(dto);
     return await task.populate('status').execPopulate();
  }

  async addUserToTask(dto:AddUserToTaskDTO, userId: string){
    const task = await this.getTaskById(dto.task);
    await this.teamService.checkEnable(task.team.toString(), userId,roleUserTeamEnum.admin);
    await this.teamService.checkEnable(task.team.toString(), dto.user);
    const filter: any = dto.user;
    console.log(task.users.find((user)=> user == filter));
    if (task.users.find((user)=> user == filter)) {
      throw new HttpException(
        'The user already has this task',
        HttpStatus.BAD_REQUEST,
      );
    }
    task.users.push(filter);
    await task.save();
    this.socketGateway.changedTask(task);
    return task;;
  }

  async deleteUserFromTask(dto:AddUserToTaskDTO, userId: string){
    const task = await this.getTaskById(dto.task);
    await this.teamService.checkEnable(task.team.toString(), userId,roleUserTeamEnum.admin);
    await this.teamService.checkEnable(task.team.toString(), dto.user);
    const filter: any = dto.user;
    console.log(task.users.find((user)=> user == filter));
    const ind = task.users.findIndex((user)=> user == filter)
    if (ind == -1) {
      throw new HttpException(
        'The user dont has this task',
        HttpStatus.BAD_REQUEST,
      );
    }
    await task.updateOne({ $pull: {  users: dto.user } });
    this.socketGateway.changedTask(task);
    return task;
  }

  async completeTask(taskId: string, userId: string ): Promise<Task>{
    const task = await this.getTaskById(taskId);
    await this.teamService.checkEnable(task.team as string, userId, roleUserTeamEnum.admin);
    const status = await this.statusService.getStatusHistory(task.team as string);
    await task.updateOne({status: status._id });
    return task;
  }

  async getHistory(teamId: string, userId: string): Promise<Array<Task>> {
    await this.teamService.checkEnable(teamId, userId);
    const status = await this.statusService.getStatusHistory(teamId);
    return await this.taskModel.find({status:status}).populate('users').exec();
  }
}
