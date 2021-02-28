import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import {
  AddTeamUserLinkDTO,
  CreateTeamDTO,
  DeleteTeamUserLinkDTO,
  UpdateTeamDTO,
} from './dto/team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createTeam(@Body() team: CreateTeamDTO, @User() { _id }: UserDocument) {
    return await this.teamService.createTeam(team, _id);
  }

  @ApiBearerAuth()
  @Get(':id')
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
  @Delete(':id/statuse')
  @UseGuards(JwtAuthGuard)
  async getStatuses(
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.teamService.getStatuses(params.id, _id);
  }
}
