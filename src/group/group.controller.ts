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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { OrganizationUser } from 'src/organization/schemas/organization-user.schema';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { Organization, User } from 'src/utilities/user.decorator';
import { CreateGroupDTO, UpdateGroupDTO } from './dto/group.dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Cookie',
    description: 'set "organization=Id;"',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @Body() group: CreateGroupDTO,
    @User() { _id }: UserDocument,
    @Organization() organizationid: string,
  ) {
    return await this.groupService.createGroup(group, organizationid, _id);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Cookie',
    description: 'set "organization=Id;"',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getGroups(
    @User() { _id }: UserDocument,
    @Organization() organizationid: string,
  ) {
    return await this.groupService.getGroups(organizationid, _id);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Cookie',
    description: 'set "organization=Id;"',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Body() updateGroupDTO: UpdateGroupDTO,
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
    @Organization() organizationid: string,
  ) {
    if (!organizationid)
      new HttpException(
        `You did not choose organization`,
        HttpStatus.UNAUTHORIZED,
      );
    return await this.groupService.updateGroup(updateGroupDTO, params.id, _id);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Cookie',
    description: 'set "organization=Id;"',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
    @Organization() organizationid: string,
  ) {
    if (!organizationid)
      new HttpException(
        `You did not choose organization`,
        HttpStatus.UNAUTHORIZED,
      );
    return await this.groupService.deleteGroup(params.id, _id);
  }
}
