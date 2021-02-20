import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationSchema,
} from './schemas/organization.schema';
import {
  OrganizationUser,
  OrganizationUserSchema,
} from './schemas/organization-user.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrganizationUser.name, schema: OrganizationUserSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
