import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationSchema,
  Notification,
} from './schemas/notification.schema';
import {
  NotificationUserLink,
  NotificationUserLinkSchema,
} from './schemas/notification-user.schema';
import { TaskModule } from 'src/task/task.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { TeamModule } from 'src/team/team.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationUserLink.name, schema: NotificationUserLinkSchema },
    ]),
    OrganizationModule,
    forwardRef(() => TaskModule),
    TeamModule,
    SocketModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
