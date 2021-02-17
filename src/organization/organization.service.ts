import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { roleUserEnum } from '../enums/role-user.enum';
import { CreateOrganizationDTO } from './dto/organization.dto';
import { IOrganization, IOrganizationUser } from './interfaces/organization.interface';
import { OrganizationUser, OrganizationUserDocument } from './schemas/organization-user.schema';
import { Organization, OrganizationDocument } from './schemas/organization.schema';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
        @InjectModel(OrganizationUser.name) private organizationUserModel: Model<OrganizationUserDocument>
    ) {}

    async create(organizationDTO: CreateOrganizationDTO, userid: string) {
        const createdOrganization = new this.organizationModel(organizationDTO);
        await createdOrganization.save();
        const organizationUser: IOrganizationUser = {
            roleUser: roleUserEnum.admin,
            organization: createdOrganization._id,
            user: userid,
        };
        const createdOrganizationUser = new this.organizationUserModel(organizationUser);
        await createdOrganizationUser.save();
        return createdOrganization;
      }
}
