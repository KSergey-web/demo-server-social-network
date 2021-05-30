import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { consoleOut } from 'src/debug';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import {
  AddStatusDTO,
  AddTeamUserLinkDTO,
  CreateTeamDTO,
  DeleteStatusDTO,
  DeleteTeamUserLinkDTO,
  UpdateTeamDTO,
} from './dto/team.dto';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async createTeam(
    @Body() team: CreateTeamDTO,
     @User() { _id }: UserDocument,
     @UploadedFile() avatar: Express.Multer.File
     ) {
      team.avatar = avatar;
    return await this.teamService.createTeam(team, _id);
  }

  @ApiBearerAuth()
  @Get('all/organization/:id')
  @UseGuards(JwtAuthGuard)
  async getTeams(@User() { _id }: UserDocument, @Param() params: ObjectIdDTO) {
    return await this.teamService.getTeams(params.id, _id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateTeam(
    @Body() updateTeamDTO: UpdateTeamDTO,
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
  ) {
    return await this.teamService.updateTeam(updateTeamDTO, params.id, _id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteTeam(
    @User() { _id }: UserDocument,
    @Param() params: ObjectIdDTO,
  ) {
    return await this.teamService.deleteTeam(params.id, _id);
  }

  @ApiBearerAuth()
  @Post('adduser')
  @UseGuards(JwtAuthGuard)
  async hireUser(
    @Body() body: AddTeamUserLinkDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.teamService.addTeamUserLink(body, _id);
  }

  @ApiBearerAuth()
  @Delete(':team/deleteuser/:user')
  @UseGuards(JwtAuthGuard)
  async fireUser(
    @Param() params: DeleteTeamUserLinkDTO,
    @User() { _id }: UserDocument,
  ): Promise<String> {
    return await this.teamService.deleteTeamUserLink(params, _id);
  }

  @ApiBearerAuth()
  @Get(':id/statuses')
  @UseGuards(JwtAuthGuard)
  async getStatuses(
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.teamService.getStatuses(params.id, _id);
  }

  @ApiBearerAuth()
  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    return await this.teamService.getUsers(params.id, _id);
  }

  @ApiBearerAuth()
  @Post('addstatus')
  @UseGuards(JwtAuthGuard)
  async addStatus(@Body() dto: AddStatusDTO, @User() { _id }: UserDocument) {
    return await this.teamService.addStatus(dto, _id);
  }

  @ApiBearerAuth()
  @Delete(':team/status/:status')
  @UseGuards(JwtAuthGuard)
  async deleteStatus(@Param() params: DeleteStatusDTO, @User() { _id }: UserDocument) {
    return await this.teamService.deleteStatus(params, _id);
  }
}
