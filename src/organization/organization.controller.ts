import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ObjectIdDTO } from '../shared/shared.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { User } from '../utilities/user.decorator';
import {
  AssignPositionDTO,
  CreateOrganizationDTO,
  FireUserDTO,
  HireUserDTO,
  UpdateOrganizationDTO,
} from './dto/organization.dto';
import { OrganizationService } from './organization.service';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { cookiesEnum } from 'src/enums/cookies.enum';
import { consoleOut } from 'src/debug';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrganization(
    @Body() order: CreateOrganizationDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.organizationService.create(order, _id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOrganization(
    @Param() params: ObjectIdDTO,
    @User() user: UserDocument,
  ) {
    await this.organizationService.deleteOrganization(params.id, user);
    return 'Organization deleted';
  }

  @ApiBearerAuth()
  @Delete('leave/:id')
  @UseGuards(JwtAuthGuard)
  async leaveOrganization(
    @Param() params: ObjectIdDTO,
    @User() user: UserDocument,
  ) {
    await this.organizationService.leaveOrganization(params.id, user);
    return 'you leave orgaanization';
  }

  @ApiBearerAuth()
  @Delete('fire/:organizationId/:userId')
  @UseGuards(JwtAuthGuard)
  async fireUser(@Param() params: FireUserDTO, @User() user: UserDocument) {
    await this.organizationService.fireUser(
      params.organizationId,
      user,
      params.userId,
    );
    return 'Worker is fired';
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param() params: ObjectIdDTO,
    @Body() organizationDTO: UpdateOrganizationDTO,
    @User() user: UserDocument,
  ) {
    return this.organizationService.updateOrganization(
      organizationDTO,
      params.id,
      user,
    );
  }

  @ApiBearerAuth()
  @Post('hire')
  @UseGuards(JwtAuthGuard)
  async hireUser(@Body() body: HireUserDTO, @User() user: UserDocument) {
    await this.organizationService.hireUser(body, user);
    return 'Worker is hired';
  }

  @ApiBearerAuth()
  @Get('set/:id')
  @UseGuards(JwtAuthGuard)
  async setCurrentOrganization(
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.organizationService.checkOrganizationAndLink(params.id, _id);
    response.cookie(cookiesEnum.organizationId, params.id);
    return 'Success cookies set';
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Cookie',
    description: 'set "organization=Id;"',
  })
  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Req() request: Request) {
    let organizationId = request.cookies[cookiesEnum.organizationId];
    return await this.organizationService.getUsers(organizationId);
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Cookie',
    description: 'set "organization=Id;"',
  })
  @Patch('position')
  @UseGuards(JwtAuthGuard)
  async assignPosition(
    @Body() assignPositionDTO: AssignPositionDTO,
    @User() { _id }: UserDocument,
    @Req() request: Request,
  ) {
    let organizationId = request.cookies[cookiesEnum.organizationId];
    return await this.organizationService.assignPosition(
      assignPositionDTO,
      organizationId,
      _id,
    );
  }
}
