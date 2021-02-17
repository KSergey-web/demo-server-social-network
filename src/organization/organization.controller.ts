import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { IUser } from '../user/interfaces/user.interface';
import { User } from '../utilities/user.decorator';
import { CreateOrganizationDTO } from './dto/organization.dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrganization(@Body() order: CreateOrganizationDTO, @User() { _id }: IUser) {
    return {organization: await this.organizationService.create(order, _id)};
  }
}
