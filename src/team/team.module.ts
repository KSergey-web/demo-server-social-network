import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamUserLink, TeamUserLinkSchema } from './schemas/team-user.schema';
import { Status, StatusSchema } from './schemas/status.schema';
import { StatusService } from './status.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: TeamUserLink.name, schema: TeamUserLinkSchema },
      { name: Status.name, schema: StatusSchema },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService, StatusService],
  exports: [TeamService, StatusService],
})
export class TeamModule {}
