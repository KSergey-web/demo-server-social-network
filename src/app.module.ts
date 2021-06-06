import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { configModule } from './configure.root';

import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';
import { OrganizationModule } from './organization/organization.module';
import { SocketModule } from './socket/socket.module';
import { MessageModule } from './message/message.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GroupModule } from './group/group.module';
import { PostModule } from './post/post.module';
import { TeamModule } from './team/team.module';
import { TaskModule } from './task/task.module';
import { NotificationModule } from './notification/notification.module';
import { FileResourceModule } from './file-resource/file-resource.module';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGODB_WRITE_CONNECTION_STRING),
    //UserModule,
    //AuthModule,
    SharedModule,
    OrganizationModule,
    SocketModule,
    //ChatModule,
    MessageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    GroupModule,
    PostModule,
    TeamModule,
    TaskModule,
    NotificationModule,
    FileResourceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
