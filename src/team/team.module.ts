import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamUserLink, TeamUserLinkSchema } from './schemas/team-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: TeamUserLink.name, schema: TeamUserLinkSchema },
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
