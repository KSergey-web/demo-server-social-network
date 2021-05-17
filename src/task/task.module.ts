import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { ColorMiddleware } from './middleware/check-color.middleware';
import { TeamModule } from 'src/team/team.module';
import { SocketModule } from 'src/socket/socket.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    TeamModule,
    SocketModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ColorMiddleware)
      .forRoutes({ path: 'task', method: RequestMethod.POST });
  }
}
