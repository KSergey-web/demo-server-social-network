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
import { FileResourceService } from 'src/file-resource/file-resource.service';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { roleUserTeamEnum } from 'src/team/enums/role-user.enum';
import { StatusService } from 'src/team/status.service';
import { TeamService } from 'src/team/team.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import {
  AddAnswerDTO,
  AddUserToTaskDTO,
  ChangeStatusDTO,
  CreateTaskDTO,
  DeleteFileFromTaskDTO,
  UpdateTaskDTO,
} from './dto/task.dto';
import { TaskService } from './task.service';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly teamService: TeamService,
    private readonly statusService: StatusService,
    private readonly fileResourceService: FileResourceService,
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
  @Get('all/team/:id')
  @UseGuards(JwtAuthGuard)
  async getTasks(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    await this.teamService.checkEnable(params.id, _id);
    return await this.taskService.getTasks(params.id);
  }

  @ApiBearerAuth()
  @Post(':id/addfile')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async addFile(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
  ) {
    const resFile = await this.fileResourceService.saveFile(file);
    return await this.taskService.addFileToTask(params.id, resFile._id, _id);
  }

  @ApiBearerAuth()
  @Delete(':taskid/file/:fileid')
  @UseGuards(JwtAuthGuard)
  async deleteFile(
    @Param() params: DeleteFileFromTaskDTO,
    @User() { _id }: UserDocument,
  ) {
    const task = await this.taskService.deleteFileFromTask(
      params.taskid,
      params.fileid,
      _id,
    );
    await this.fileResourceService.deleteFile(params.fileid);
    return task;
  }

  @ApiBearerAuth()
  @Patch('status')
  @UseGuards(JwtAuthGuard)
  async changeStatus(
    @Body() dto: ChangeStatusDTO,
    @User() { _id }: UserDocument,
  ) {
    const status = await this.statusService.getStatusById(dto.status);
    return await this.taskService.changeStatus(dto, status.team as string, _id);
  }

  @ApiBearerAuth()
  @Patch(':id/take')
  @UseGuards(JwtAuthGuard)
  async takeTask(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    return await this.taskService.takeTask(params.id, _id);
  }

  @ApiBearerAuth()
  @Patch('adduser')
  @UseGuards(JwtAuthGuard)
  async addUserToTask(
    @Body() dto: AddUserToTaskDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.taskService.addUserToTask(dto, _id);
  }

  @ApiBearerAuth()
  @Patch('deleteuser')
  @UseGuards(JwtAuthGuard)
  async deleteUserFromTask(
    @Body() dto: AddUserToTaskDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.taskService.deleteUserFromTask(dto, _id);
  }

  @ApiBearerAuth()
  @Patch('answer')
  @UseGuards(JwtAuthGuard)
  async addAnswer(@Body() dto: AddAnswerDTO, @User() { _id }: UserDocument) {
    return await this.taskService.addAnswer(dto, _id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Param() params: ObjectIdDTO,
    @Body() dto: UpdateTaskDTO,
    @User() { _id }: UserDocument,
  ) {
    consoleOut(dto);
    return await this.taskService.updateTask(params.id, dto, _id);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTask(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    return await this.taskService.getTask(params.id, _id);
  }

  @ApiBearerAuth()
  @Patch('status/complete')
  @UseGuards(JwtAuthGuard)
  async completeTask(@Body() body: ObjectIdDTO, @User() { _id }: UserDocument) {
    return await this.taskService.completeTask(body.id, _id);
  }

  @ApiBearerAuth()
  @Get('history/team/:id')
  @UseGuards(JwtAuthGuard)
  async historyTasks(
    @Param() params: ObjectIdDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.taskService.getHistory(params.id, _id);
  }
}
