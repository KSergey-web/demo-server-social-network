import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { roleUserTeamEnum } from 'src/team/enums/role-user.enum';
import { StatusService } from 'src/team/status.service';
import { TeamService } from 'src/team/team.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { AddAnswerDTO, ChangeStatusDTO, CreateTaskDTO } from './dto/task.dto';
import { TaskService } from './task.service';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly teamService: TeamService,
    private readonly statusService: StatusService,
  ) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createTask(@Body() dto: CreateTaskDTO, @User() { _id }: UserDocument) {
    await this.teamService.checkEnable(dto.team, _id, roleUserTeamEnum.admin);
    await this.statusService.getStatusById(dto.status);
    return await this.taskService.createTask(dto);
  }

  @ApiBearerAuth()
  @Get('team/:id')
  @UseGuards(JwtAuthGuard)
  async getTasks(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    await this.teamService.checkEnable(params.id, _id);
    return await this.taskService.getTasks(params.id);
  }

  @ApiBearerAuth()
  @Patch('status')
  @UseGuards(JwtAuthGuard)
  async changeStatus(
    @Body() dto: ChangeStatusDTO,
    @User() { _id }: UserDocument,
  ) {
    await this.teamService.checkEnable(dto.team, _id, roleUserTeamEnum.admin);
    await this.statusService.getStatusById(dto.status);
    return await this.taskService.changeStatus(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async takeTask(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    return await this.taskService.takeTask(params.id, _id);
  }

  @ApiBearerAuth()
  @Patch('answer')
  @UseGuards(JwtAuthGuard)
  async addAnswer(@Body() dto: AddAnswerDTO, @User() { _id }: UserDocument) {
    return await this.taskService.addAnswer(dto, _id);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTask(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    return await this.taskService.getTask(params.id, _id);
  }
}