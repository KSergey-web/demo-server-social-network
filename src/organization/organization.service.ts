import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { roleUserOrganizationEnum } from '../organization/enums/role-user.enum';
import {
  AssignPositionDTO,
  CreateOrganizationDTO,
  HireUserDTO,
  UpdateOrganizationDTO,
} from './dto/organization.dto';
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
      roleUser: roleUserOrganizationEnum.superUser,
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
    organizationid: string,
    userid: string,
  ): Promise<OrganizationUserDocument> {
    const obj: any = {
      user: userid,
      organization: organizationid,
    };
    const link = await this.organizationUserModel.findOne(
      obj 
    );
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
    if (link.roleUser != roleUserOrganizationEnum.superUser) {
      throw new HttpException(
        'You are not owner this organization',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async checkAccess(
    link: OrganizationUserDocument,
    ...roles: Array<roleUserOrganizationEnum>
  ): Promise<OrganizationUserDocument> {
    let access: Boolean = false;
    let rolestr: string;
    roles.forEach(function(item, i, arr) {
      if (item == link.roleUser) {
        access = true;
      }
      rolestr += item + '/';
    });
    if (!access) {
      throw new HttpException(
        `You are not ${rolestr} this organization`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async deleteOrganization(id: string, user: UserDocument) {
    const organization = await this.checkOrganizationById(id);
    const link = await this.organizationUserLink(organization._id, user._id);
    await this.checkOwnerOrganization(link);
    await organization.deleteOne();
    return await this.organizationUserModel.deleteMany({
      organization: link.organization,
    });
  }

  async leaveOrganization(id: string, user: UserDocument) {
    const link = await this.organizationUserLink(
      (await this.checkOrganizationById(id))._id,
      user._id,
    );
    if (link.roleUser == roleUserOrganizationEnum.superUser) {
      return this.deleteOrganization(id, user);
    } else return await link.deleteOne();
  }

  async checkOrganizationAndLink(id: string, userId: string) {
    const link = await this.organizationUserLink(
      (await this.checkOrganizationById(id))._id,
      userId,
    );
    return link;
  }

  async fireUser(id: string, admin: UserDocument, userid: string) {
    const organization = await this.checkOrganizationById(id);
    const adminlink = await this.organizationUserModel.findOne({
      user: admin._id,
      organization: organization,
    });
    const user = await this.userService.checkUserById(userid);
    await this.checkAccess(
      adminlink,
      roleUserOrganizationEnum.superUser,
      roleUserOrganizationEnum.admin,
    );
    const userlink = await this.organizationUserModel.findOne({
      user: user,
      organization: organization,
    });
    await this.checkOwnerOrganization(userlink);
    return await userlink.deleteOne();
  }

  async hireUser(hireUserDTO: HireUserDTO, admin: UserDocument) {
    const organization = await this.checkOrganizationById(
      hireUserDTO.organizationId,
    );
    const adminlink = await this.organizationUserModel.findOne({
      user: admin._id,
      organization: organization,
    });
    const filter:any = {
      user: hireUserDTO.userId,
      organization: organization._id,
    }
    const checkUserlink = await this.organizationUserModel.findOne(filter);
    if (checkUserlink){
      throw new HttpException(
        `User ${checkUserlink._id} already in the organization`,
        HttpStatus.CONFLICT,
      );
    }
    await this.checkAccess(
      adminlink,
      roleUserOrganizationEnum.superUser,
      roleUserOrganizationEnum.admin,
    );
    const createdOrganizationUser = new this.organizationUserModel({
      position: hireUserDTO.position,
      organization: organization,
      user: await this.userService.checkUserById(hireUserDTO.userId),
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

  async updateOrganization(
    organizationDTO: UpdateOrganizationDTO,
    organizationId: string,
    user: UserDocument,
  ): Promise<string> {
    const organization = await this.checkOrganizationById(organizationId);
    const link = await this.organizationUserLink(organization._id, user._id);
    await this.checkOwnerOrganization(link);
    await organization.updateOne(organizationDTO);
    return 'Organization updated';
  }

  async getUsers(organizationId: any): Promise<OrganizationUserDocument[]> {
    let links = await this.organizationUserModel
      .find({ organization: organizationId })
      .populate('user');
    return links;
  }

  async assignPosition(
    assignPositionDTO: AssignPositionDTO,
    organizationid: string,
    olderid: string,
  ) {
    const olderlink = await this.organizationUserLink(organizationid, olderid);
    await this.checkAccess(
      olderlink,
      roleUserOrganizationEnum.superUser,
      roleUserOrganizationEnum.admin,
    );
    try {
      const userlink = await this.organizationUserLink(
        organizationid,
        assignPositionDTO.userId,
      );
      return userlink.updateOne({ position: assignPositionDTO.position });
    } catch (err) {
      throw new HttpException(
        'User not found in this organization',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrganizations(userId: string): Promise<Array<OrganizationUserDocument>>{
    const filter: any ={user:userId}; 
    const links = await this.organizationUserModel.find(filter).populate('organization').populate('user').exec();
    return links;
  }

}
