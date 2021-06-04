import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { roleUserGroupEnum } from 'src/group/enums/role-user.enum';
import { GroupService } from 'src/group/group.service';
import { OrganizationService } from 'src/organization/organization.service';
import { CreatePostDTO } from './dto/post.dto';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
    private readonly groupService: GroupService,
    private readonly organizationService: OrganizationService,
  ) {}

  async createPost(
    createPostDTO: CreatePostDTO,
    userId: string,
  ): Promise<PostDocument> {
    const group = await this.groupService.getGroupById(createPostDTO.group);
    if (!group.isOpen) {
      await this.groupService.groupUserLink(createPostDTO.group, userId);
    }
    const postObj = {
      ...createPostDTO,
      date: new Date(),
      user: userId,
      files: createPostDTO.files,
    };
    const post = new this.postModel(postObj);
    await post.save();
    await post
      .populate('user')
      .populate('files')
      .execPopulate();
    return post;
  }

  async deletePost(postId: string, userId: string): Promise<String> {
    const post = await this.postModel.findById(postId);
    const groupId = post.user.toString();
    if (!(groupId == userId)) {
      const link = await this.groupService.groupUserLink(groupId, userId);
      await this.groupService.checkAccess(link, roleUserGroupEnum.admin);
    }
    await post.deleteOne();
    return 'Post deleted';
  }

  async getPosts(
    groupId: string,
    userId: string,
  ): Promise<Array<PostDocument>> {
    const group = await this.groupService.getGroupById(groupId);
    if (group.isOpen) {
      await this.organizationService.checkOrganizationAndLink(
        group.organization.toString(),
        userId,
      );
    } else {
      await this.groupService.groupUserLink(groupId, userId);
    }
    const filter: any = { group: groupId };
    const posts = await this.postModel
      .find(filter)
      .sort({ date: -1 })
      .populate('user')
      .populate('files')
      .exec();
    return posts;
  }
}
