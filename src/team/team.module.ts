import { forwardRef, Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamUserLink, TeamUserLinkSchema } from './schemas/team-user.schema';
import { Status, StatusSchema } from './schemas/status.schema';
import { StatusService } from './status.service';
import { OrganizationModule } from 'src/organization/organization.module';
import { SocketModule } from 'src/socket/socket.module';
import { TaskModule } from 'src/task/task.module';
import { FileResourceModule } from 'src/file-resource/file-resource.module';

@Module({
  imports: [
    OrganizationModule,
    FileResourceModule,
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: TeamUserLink.name, schema: TeamUserLinkSchema },
      { name: Status.name, schema: StatusSchema },
    ]),
    SocketModule,
    forwardRef(() => TaskModule)
  ],
  controllers: [TeamController],
  providers: [TeamService, StatusService],
  exports: [TeamService, StatusService],
})
export class TeamModule {}
