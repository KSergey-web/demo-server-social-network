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
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
  HireWithLoginDTO,
  UpdateOrganizationDTO,
} from './dto/organization.dto';
import { OrganizationService } from './organization.service';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { cookiesEnum } from 'src/enums/cookies.enum';
import { consoleOut } from 'src/debug';
import { UserService } from 'src/user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('organization')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async createOrganization(
    @Body() dto: CreateOrganizationDTO,
    @User() { _id }: UserDocument,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    dto.avatar = avatar;
    return await this.organizationService.create(dto, _id);
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
    return {message:'Worker is fired'};
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
    return { message: 'Worker is hired' };
  }

  @ApiBearerAuth()
  @Post('hirewithlogin')
  @UseGuards(JwtAuthGuard)
  async hireUserWithLogin(
    @Body() dto: HireWithLoginDTO,
    @User() user: UserDocument,
  ) {
    const hireUser = await this.userService.checkByLogin(dto.login);
    const modifyDto: HireUserDTO = {
      userId: hireUser._id,
      position: dto.position,
      organizationId: dto.organizationId,
    };
    await this.organizationService.hireUser(modifyDto, user);
    return { message: 'Worker is hired' };
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
    return { organization: params.id };
  }

  // @ApiBearerAuth()
  // @Get('all')
  // @UseGuards(JwtAuthGuard)
  // async getOrganizations(
  //   @User() { _id }: UserDocument
  // ) {
  //   return (await this.organizationService.getOrganizations( _id));
  // }

  @ApiBearerAuth()
  @Get('all/:id')
  @UseGuards(JwtAuthGuard)
  async getOrganizationsByUserId(@Param() params: ObjectIdDTO) {
    return await this.organizationService.getOrganizations(params.id);
  }

  @ApiBearerAuth()
  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Param() params: ObjectIdDTO) {
    let links: any = await this.organizationService.getUsers(params.id);
    let newArray = [];
    links.map(link => {
      let obj = link.toObject();
      obj.user.status = this.userService.getStatusUser(link.user._id);
      newArray.push(obj);
      return obj;
    });
    return newArray;
  }

  @ApiBearerAuth()
  @Patch(':id/position')
  @UseGuards(JwtAuthGuard)
  async assignPosition(
    @Body() assignPositionDTO: AssignPositionDTO,
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
  ) {
    return await this.organizationService.assignPosition(
      assignPositionDTO,
      params.id,
      _id,
    );
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrganization(
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
  ) {
    return await this.organizationService.checkOrganizationById(params.id);
  }
}
