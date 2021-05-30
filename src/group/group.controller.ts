import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { OrganizationUser } from 'src/organization/schemas/organization-user.schema';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { Organization, User } from 'src/utilities/user.decorator';
import {
  AddGroupUserLinkDTO,
  CreateGroupDTO,
  DeleteGroupUserLinkDTO,
  UpdateGroupDTO,
} from './dto/group.dto';
import { GroupService } from './group.service';

@ApiTags('group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async createGroup(
    @Body() dto: CreateGroupDTO,
    @User() { _id }: UserDocument,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    dto.avatar = avatar;
    return await this.groupService.createGroup(dto, dto.organization, _id);
  }

  @ApiBearerAuth()
  @Get('all/organization/:id')
  @UseGuards(JwtAuthGuard)
  async getGroups(@User() { _id }: UserDocument, @Param() params: ObjectIdDTO) {
    return await this.groupService.getGroups(params.id, _id);
  }

  @ApiBearerAuth()
  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@User() { _id }: UserDocument, @Param() params: ObjectIdDTO) {
    return await this.groupService.getUsers(params.id, _id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Body() updateGroupDTO: UpdateGroupDTO,
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
  ) {
    return await this.groupService.updateGroup(updateGroupDTO, params.id, _id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
  ) {
    return await this.groupService.deleteGroup(params.id, _id);
  }

  @ApiBearerAuth()
  @Post('adduser')
  @UseGuards(JwtAuthGuard)
  async hireUser(
    @Body() body: AddGroupUserLinkDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.groupService.addGroupUserLink(body, _id);
  }

  @ApiBearerAuth()
  @Delete(':group/deleteuser/:user')
  @UseGuards(JwtAuthGuard)
  async fireUser(
    @Param() params: DeleteGroupUserLinkDTO,
    @User() { _id }: UserDocument,
  ): Promise<String> {
    return await this.groupService.deleteGroupUserLink(params, _id);
  }
}
