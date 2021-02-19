import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ObjectIdDTO } from '../shared/shared.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { User } from '../utilities/user.decorator';
import { CreateOrganizationDTO, FireUserDTO } from './dto/organization.dto';
import { IOrganization } from './interfaces/organization.interface';
import { OrganizationService } from './organization.service';
import { OrganizationDocument } from './schemas/organization.schema';


@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}


  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrganization(@Body() order: CreateOrganizationDTO, @User() { _id }: UserDocument) {
    return await this.organizationService.create(order, _id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOrganization(@Param() params: ObjectIdDTO, @User() user: UserDocument) {
    await this.organizationService.deleteOrganization(params.id, user);
    return "Organization deleted";
  }

  @Delete('leave/:id')
  @UseGuards(JwtAuthGuard)
  async leaveOrganization(@Param() params: ObjectIdDTO, @User() user: UserDocument) {
    await this.organizationService.leaveOrganization(params.id, user);
    return "you leave orgaanization";
  }

  @Delete('fire/:organizationId/:userId')
  @UseGuards(JwtAuthGuard)
  async fireUser(@Param() params: FireUserDTO, @User() user: UserDocument) {
    await this.organizationService.fireUser(params.organizationId, user, params.userId );
    return "Worker fired";
  }
}
