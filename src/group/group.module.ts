import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import {
  GroupUserLink,
  GroupUserLinkSchema,
} from './schemas/group-user.schema';
import { Organization } from 'src/utilities/user.decorator';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [
    OrganizationModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupUserLink.name, schema: GroupUserLinkSchema },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
