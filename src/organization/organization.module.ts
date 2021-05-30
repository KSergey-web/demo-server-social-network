import { forwardRef, Module } from '@nestjs/common';
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
import { FileResourceModule } from 'src/file-resource/file-resource.module';

@Module({
  imports: [
    FileResourceModule,
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrganizationUser.name, schema: OrganizationUserSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
