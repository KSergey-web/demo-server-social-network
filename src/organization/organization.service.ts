import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { roleUserEnum } from '../enums/role-user.enum';
import { CreateOrganizationDTO, UpdateOrganizationDTO } from './dto/organization.dto';
import {
  IOrganization,
  IOrganizationUser,
} from './interfaces/organization.interface';
import {
  OrganizationUser,
  OrganizationUserDocument,
} from './schemas/organization-user.schema';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { consoleOut } from 'src/debug';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(OrganizationUser.name)
    private organizationUserModel: Model<OrganizationUserDocument>,
    private readonly userService: UserService,
  ) {}

  async create(organizationDTO: CreateOrganizationDTO, userid: string) {
    const createdOrganization = new this.organizationModel(organizationDTO);
    await createdOrganization.save();
    const organizationUser: IOrganizationUser = {
      roleUser: roleUserEnum.admin,
      organization: createdOrganization._id,
      user: userid,
    };
    const createdOrganizationUser = new this.organizationUserModel(
      organizationUser,
    );
    await createdOrganizationUser.save();
    return createdOrganization;
  }

  async organizationUserLink(
    organization: OrganizationDocument,
    user: UserDocument,
  ): Promise<OrganizationUserDocument> {
    const link = await this.organizationUserModel.findOne({
      user: user._id,
      organization: organization._id,
    });
    if (!link) {
      throw new HttpException(
        'You do not have this organization',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async checkOwnerOrganization(
    link: OrganizationUserDocument,
  ): Promise<OrganizationUserDocument> {
    if (link.roleUser != roleUserEnum.admin) {
      throw new HttpException(
        'You are not owner this organization',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async deleteOrganization(id: string, user: UserDocument) {
    const organization = await this.checkOrganizationById(id);
    const link = await this.organizationUserLink(organization, user);
    await this.checkOwnerOrganization(link);
    await organization.deleteOne();
    return await this.organizationUserModel.deleteMany({
      organization: link.organization,
    });
  }

  async leaveOrganization(id: string, user: UserDocument) {
    const link = await this.organizationUserLink(
      await this.checkOrganizationById(id),
      user,
    );
    if (link.roleUser == roleUserEnum.admin) {
      return this.deleteOrganization(id, user);
    } else return await link.deleteOne();
  }

  async checkOrganizationAndLink(id: string, user: UserDocument) {
    const link = await this.organizationUserLink(
      await this.checkOrganizationById(id),
      user,
    );
    consoleOut(link,"lll");
    return link;
  }
  

  async fireUser(id: string, admin: UserDocument, user: string) {
    const organization = await this.checkOrganizationById(id);
    consoleOut(id,"org");
    consoleOut(admin,"adm");
    consoleOut(user,"user");
    const link = await this.organizationUserModel.findOne({
      user: admin._id,
      organization: organization,
    });
    consoleOut(await this.userService.checkUserById(user),"link")
    await this.checkOwnerOrganization(link);
    return await this.organizationUserModel.deleteOne({
      organization: organization,
      user: await this.userService.checkUserById(user),
    });
  }

  async hireUser(id: string, admin: UserDocument, user: string) {
    const organization = await this.checkOrganizationById(id);
    const link = await this.organizationUserModel.findOne({
      user: admin._id,
      organization: organization,
    });
    await this.checkOwnerOrganization(link);
    const createdOrganizationUser = new this.organizationUserModel({
      organization: organization,
      user: await this.userService.checkUserById(user)
  });
    return await createdOrganizationUser.save();
  }

  async checkOrganizationById(id: string): Promise<OrganizationDocument> {
    const organization = await this.organizationModel.findById(id);
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.BAD_REQUEST);
    }
    return organization;
  }

  async updateOrganization(organizationDTO: UpdateOrganizationDTO, organizationId: string, user: UserDocument): Promise<string> {
    const organization = await this.checkOrganizationById(organizationId);
    const link = await this.organizationUserLink(organization, user);
    await this.checkOwnerOrganization(link);
    await organization.updateOne(organizationDTO);
    return "Organization updated";
  }

  async getUsers(organizationId:any): Promise<OrganizationUserDocument[]> {
    let links = await this.organizationUserModel.find({organization:organizationId}).populate('user');
    return links;
  }
}