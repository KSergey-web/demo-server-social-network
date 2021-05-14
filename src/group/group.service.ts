import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { OrganizationService } from 'src/organization/organization.service';
import {
  AddGroupUserLinkDTO,
  CreateGroupDTO,
  DeleteGroupUserLinkDTO,
  UpdateGroupDTO,
} from './dto/group.dto';
import { roleUserGroupEnum } from './enums/role-user.enum';
import { IGroupUserLink } from './interfaces/group.interface';
import {
  GroupUserLink,
  GroupUserLinkDocument,
} from './schemas/group-user.schema';
import { Group, GroupDocument } from './schemas/group.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
    @InjectModel(GroupUserLink.name)
    private groupUserLinkModel: Model<GroupUserLinkDocument>,
    private organizationService: OrganizationService,
  ) {}

  async createGroup(
    createGroupDTO: CreateGroupDTO,
    organizationId: string,
    userId: string,
  ) {
    const group = new this.groupModel({
      ...createGroupDTO,
      organization: await this.organizationService.checkOrganizationById(
        organizationId,
      ),
    });
    await group.save();
    const groupUserLink: IGroupUserLink = {
      roleUser: roleUserGroupEnum.admin,
      group: group._id,
      user: userId,
    };
    const link = new this.groupUserLinkModel(groupUserLink);
    await link.save();
    return group;
  }

  async getGroups(
    organizationId: string,
    userId: string,
  ): Promise<Array<Group>> {
    await this.organizationService.checkOrganizationById(organizationId);
    const links = await this.groupUserLinkModel.find({user:userId})
    const groups = await this.groupModel.find({organization:organizationId});
    groups.filter(group=>{
      if (group.isOpen)
        return true;
      return links.find(link => {return ((link.user.toString() == userId) && (link.group ==  group._id))})
    })
    return groups;
  }

  async getUsers(
    groupId: string,
    userId: string,
  ): Promise<Array<GroupUserLink>> {
    await this.getGroupById(groupId);
    await this.groupUserLink(groupId, userId);
    const links = await this.groupUserLinkModel.find({group:groupId}).populate('user').exec();
    return links;
  }

  async getGroupById(id: string): Promise<GroupDocument> {
    const group = await this.groupModel.findById(id);
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.BAD_REQUEST);
    }
    return group;
  }

  async groupUserLink(
    groupid: string,
    userid: string,
  ): Promise<GroupUserLinkDocument> {
    const obj: IGroupUserLink = {
      user: userid,
      group: groupid,
    };
   
    const link = await this.groupUserLinkModel.findOne(
      obj,
    );
    if (!link) {
      throw new HttpException(
        'You do not have this group',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async checkAccess(
    link: GroupUserLinkDocument,
    ...roles: Array<roleUserGroupEnum>
  ): Promise<GroupUserLinkDocument> {
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
        `You are not ${rolestr} in this group`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return link;
  }

  async updateGroup(
    updateGroupDTO: UpdateGroupDTO,
    groupId: string,
    userId: string,
  ) {
    const group = await this.getGroupById(groupId);
    const link = await this.groupUserLink(groupId, userId);
    await this.checkAccess(link, roleUserGroupEnum.admin);
    return await group.updateOne(updateGroupDTO);
  }

  async deleteGroup(groupId: string, userId: string): Promise<string> {
    const group = await this.getGroupById(groupId);
    const link = await this.groupUserLink(groupId, userId);
    await this.checkAccess(link, roleUserGroupEnum.admin);
    await group.deleteOne();
    await this.groupUserLinkModel.deleteMany({
      group: group._id,
    });
    return 'Group deleted';
  }

  async addGroupUserLink(
    dto: AddGroupUserLinkDTO,
    userId: string,
  ): Promise<GroupUserLinkDocument> {
    const group = await this.getGroupById(dto.group);
    const link = await this.groupUserLink(dto.group, userId);
    await this.checkAccess(link, roleUserGroupEnum.admin);
    const newLink = new this.groupUserLinkModel(dto);
    return await newLink.save();
  }

  async deleteGroupUserLink(
    dto: DeleteGroupUserLinkDTO,
    userId: string,
  ): Promise<string> {
    await this.getGroupById(dto.group);
    const link = await this.groupUserLink(dto.group, userId);
    await this.checkAccess(link, roleUserGroupEnum.admin);
    const filter: any = dto;
    const check = await this.groupUserLinkModel.deleteOne(filter);
    if (check.n != 1)
      throw new HttpException(
        'Group member is not found',
        HttpStatus.BAD_REQUEST,
      );
    return 'Group member deleted';
  }
}
