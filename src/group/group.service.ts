import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDTO, UpdateGroupDTO } from './dto/group.dto';
import { roleUserEnum } from './enums/role-user.enum';
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
  ) {}

  async createGroup(
    createGroupDTO: CreateGroupDTO,
    organizationId: string,
    userId: string,
  ) {
    const group = new this.groupModel({
      ...createGroupDTO,
      organization: organizationId,
    });
    await group.save();
    const groupUserLink: IGroupUserLink = {
      roleUser: roleUserEnum.admin,
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
    const groups = await this.groupUserLinkModel
      .find({ organization: organizationId })
      .or([{ isOpen: true }, { user: userId }])
      .populate('group');
    return groups.map(res => {
      return res.group;
    });
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
    const link = await this.groupUserLinkModel.findOne({
      obj,
    });
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
    ...roles: Array<roleUserEnum>
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
  ): Promise<string> {
    const group = await this.getGroupById(groupId);
    const link = await this.groupUserLink(groupId, userId);
    await this.checkAccess(link, roleUserEnum.admin);
    await group.updateOne(updateGroupDTO);
    return 'Group updated';
  }

  async deleteGroup(groupId: string, userId: string): Promise<string> {
    const group = await this.getGroupById(groupId);
    const link = await this.groupUserLink(groupId, userId);
    await this.checkAccess(link, roleUserEnum.admin);
    await group.deleteOne();
    await this.groupUserLinkModel.deleteMany({
      group: group._id,
    });
    return 'Group updated';
  }
}
