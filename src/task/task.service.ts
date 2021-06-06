import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { phaseEnum } from 'src/notification/enums/phase.enum';
import { NotificationService } from 'src/notification/notification.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { roleUserTeamEnum } from 'src/team/enums/role-user.enum';
import { Status, StatusDocument } from 'src/team/schemas/status.schema';
import { StatusService } from 'src/team/status.service';
import { TeamService } from 'src/team/team.service';
import {
  AddAnswerDTO,
  AddUserToTaskDTO,
  ChangeStatusDTO,
  CreateTaskDTO,
  UpdateTaskDTO,
} from './dto/task.dto';
import { colorEnum } from './enums/color.enum';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
    private readonly socketGateway: SocketGateway,
    @Inject(forwardRef(() => StatusService))
    private readonly statusService: StatusService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  async createTask(dto: CreateTaskDTO) {
    const task = new this.taskModel({ ...dto, date: new Date() });
    await task.save();
    await task
      .populate('status')
      .populate('users')
      .populate('team')
      .execPopulate();
    this.socketGateway.createdTask(task);
    return task;
  }

  async deleteTasksFromStatus(status: Status) {
    const tasks = await this.taskModel.deleteMany({ status });
  }

  async getTasks(teamId: string): Promise<Array<TaskDocument>> {
    const filter: any = { team: teamId };
    return await this.taskModel
      .find(filter)
      .populate('status')
      .populate('users')
      .populate('files')
      .exec();
  }

  async changeStatus(
    dto: ChangeStatusDTO,
    teamId: string,
  ): Promise<TaskDocument> {
    const task = await this.taskModel.findById(dto.task);
    if (task.team.toString() != teamId) {
      throw new HttpException(
        'This Task is not belong this team',
        HttpStatus.BAD_REQUEST,
      );
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
    try {
      if (!task.users.find(filter)) {
        throw new HttpException(
          'The user do not has this task',
          HttpStatus.BAD_REQUEST,
        );
      }
      return;
    } catch (err) {
      this.teamService.checkEnable(
        task.team.toString(),
        userId,
        roleUserTeamEnum.admin,
      );
    }
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
    taskId: string,
    dto: UpdateTaskDTO,
    userId: string,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);
    this.teamService.checkEnable(
      task.team as string,
      userId,
      roleUserTeamEnum.admin,
    );
    this.compareDeadline(task, dto);
    if (dto.color == colorEnum.green) dto.deadline = null;
    await task.updateOne(dto);
    this.socketGateway.changedTask(task);
    return await task.populate('status').execPopulate();
  }

  compareDeadline(task: Task, dto: UpdateTaskDTO) {
    if (task.deadline != dto.deadline) {
      this.notificationService.delete(task._id);
    }
  }

  async addUserToTask(dto: AddUserToTaskDTO, userId: string) {
    const task = await this.getTaskById(dto.task);
    await this.teamService.checkEnable(
      task.team.toString(),
      userId,
      roleUserTeamEnum.admin,
    );
    await this.teamService.checkEnable(task.team.toString(), dto.user);
    const filter: any = dto.user;
    if (task.users.find(user => user == filter)) {
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

  async addFileToTask(taskId: string, fileId: any, userId: string) {
    const task = await this.getTaskById(taskId);
    await this.teamService.checkEnable(task.team.toString(), userId);
    task.files.push(fileId);
    await task.save();
    await task.populate('files').execPopulate();
    return task;
  }

  async deleteFileFromTask(taskId: string, fileId: any, userId: string) {
    let task = await this.getTaskById(taskId);
    await this.teamService.checkEnable(task.team.toString(), userId);
    await task.updateOne({ $pull: { files: fileId } });
    task = await this.getTaskById(taskId);
    await task.populate('files').execPopulate();
    return task;
  }

  async deleteUserFromTask(dto: AddUserToTaskDTO, userId: string) {
    const task = await this.getTaskById(dto.task);
    await this.teamService.checkEnable(
      task.team.toString(),
      userId,
      roleUserTeamEnum.admin,
    );
    await this.teamService.checkEnable(task.team.toString(), dto.user);
    const filter: any = dto.user;
    console.log(task.users.find(user => user == filter));
    const ind = task.users.findIndex(user => user == filter);
    if (ind == -1) {
      throw new HttpException(
        'The user dont has this task',
        HttpStatus.BAD_REQUEST,
      );
    }
    await task.updateOne({ $pull: { users: dto.user } });
    this.socketGateway.changedTask(task);
    return task;
  }

  async completeTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    await this.teamService.checkEnable(
      task.team as string,
      userId,
      roleUserTeamEnum.admin,
    );
    const status = await this.statusService.getStatusHistory(
      task.team as string,
    );
    await task.updateOne({ status: status._id, completionDate: new Date() });
    return task;
  }

  async getHistory(teamId: string, userId: string): Promise<Array<Task>> {
    await this.teamService.checkEnable(teamId, userId);
    const status = await this.statusService.getStatusHistory(teamId);
    return await this.taskModel
      .find({ status: status })
      .sort({ date: -1 })
      .populate('users')
      .populate('files')
      .exec();
  }

  taskIsExpired(task: Task): boolean {
    if (task.deadline < new Date()) return true;
    else return false;
  }

  taskIsLeft10(task: Task): boolean {
    const interval: number = task.deadline.getTime() - task.date.getTime();
    const per10 = (interval * 10) / 100;
    if (task.deadline.getTime() - new Date().getTime() < per10) return true;
    else return false;
  }

  async checkPhaseForTasks() {
    let tasks = await this.taskModel
      .find({ color: colorEnum.orange })
      .populate('team')
      .populate('status')
      .exec();
    tasks.filter(task => (task.status as Status).position != -1);
    for (let i = 0; i < tasks.length; ++i) {
      if (this.taskIsExpired(tasks[i])) {
        this.notificationService.create(tasks[i], phaseEnum.expired);
        await tasks[i].updateOne({ color: colorEnum.red });
        tasks[i].color = colorEnum.red;
        this.socketGateway.changedTask(tasks[i]);
      } else if (this.taskIsLeft10(tasks[i])) {
        this.notificationService.create(tasks[i], phaseEnum.left10);
      }
    }
  }

  onApplicationBootstrap() {
    this.initTimerForTasks();
  }

  initTimerForTasks() {
    let timerId = setInterval(() => {
      this.checkPhaseForTasks();
    }, 10000);
    return timerId;
  }
}
