import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { OrganizationService } from 'src/organization/organization.service';
import { SocketService } from 'src/socket/socket.service';
import { TaskDocument } from 'src/task/schemas/task.schema';
import { TaskService } from 'src/task/task.service';
import { Team } from 'src/team/schemas/team.schema';
import { TeamService } from 'src/team/team.service';
import { phaseEnum } from './enums/phase.enum';
import {
  NotificationUserLink,
  NotificationUserLinkDocument,
} from './schemas/notification-user.schema';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationUserLink.name)
    private notificationUserLinkModel: Model<NotificationUserLinkDocument>,
    private readonly organizationService: OrganizationService,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
    private readonly teamService: TeamService,
    private readonly socketService: SocketService,
  ) {}

  getRemainsTime(deadline: Date): {} | null {
    let diffMs = deadline.getTime() - new Date().getTime(); // milliseconds
    if (diffMs < 0) return null;
    let days = Math.floor(diffMs / 86400000); // days
    let hours = Math.floor((diffMs % 86400000) / 3600000); // hours
    let minutes = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return { days, hours, minutes };
  }

  async getNotification(userId: string) {
    const links = await this.notificationUserLinkModel
      .find({ user: userId })
      .populate('notification')
      .exec();
    let nots = [];
    let remains;
    for (let i = 0; i < links.length; ++i) {
      nots.push({
        isReaded: links[i].isReaded,
        phase: (links[i].notification as Notification).phase,
        organization: await this.organizationService.checkOrganizationById(
          (links[i].notification as Notification).organization as string,
        ),
        team: await this.teamService.getTeamById(
          (links[i].notification as Notification).team as string,
        ),
        task: await this.taskService.getTaskById(
          (links[i].notification as Notification).task as string,
        ),
        date: (links[i].notification as Notification).date,
      });
      remains = this.getRemainsTime(nots[i].task.deadline);
      if (remains) {
        nots[i].remains = remains;
      }
    }
    return nots;
  }

  async create(task: TaskDocument, phase: phaseEnum) {
    consoleOut(task, 'noti');
    consoleOut(phase, 'ph');
    const check = await this.notificationModel
      .findOne({ task: task._id, phase })
      .exec();
    if (check) return;
    const not: Notification = {
      date: new Date(),
      phase,
      team: (task.team as Team)._id,
      organization: (task.team as Team).organization,
      task: task._id,
    };
    const createdNotification = new this.notificationModel(not);
    await createdNotification.save();
    task.users.forEach(async user => {
      const link: NotificationUserLink = {
        notification: createdNotification,
        user: user,
      };
      const createdNotificationUser = new this.notificationUserLinkModel(link);
      await createdNotificationUser.save();
      this.socketService.newNotificationEvent(user.toString());
    });
  }

  async delete(taskId: string) {
    const nots = await this.notificationModel.find({ task: taskId }).exec();
    nots.forEach(async not => {
      await this.notificationUserLinkModel.deleteMany({
        notification: not._id,
      });
      await not.deleteOne();
    });
  }

  async markAllAsReaded(userId: string) {
    const links = await this.notificationUserLinkModel
      .find({ user: userId })
      .exec();
    links.forEach(async link => {
      link.isReaded = true;
      link.save();
    });
    return;
  }

  async getNotReaded(userId: string): Promise<number> {
    const links = await this.notificationUserLinkModel
      .find({ user: userId, isReaded: false })
      .exec();
    return links.length;
  }
}
