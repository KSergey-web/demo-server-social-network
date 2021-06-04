import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { consoleOut } from 'src/debug';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { AvatarTypeDTO } from './dto/file-resource.dto';
import { FileResourceService } from './file-resource.service';

@Controller('file-resource')
export class FileResourceController {
  constructor(private readonly fileResourceService: FileResourceService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async file(@UploadedFile() file: Express.Multer.File) {
    return this.fileResourceService.saveFile(file);
  }

  @Get(':id')
  async getFile(@Res({ passthrough: true }) res, @Param() params: ObjectIdDTO) {
    const obj = await this.fileResourceService.getFile(params.id);
    try {
      res.setHeader('Content-Type', obj.fileRes.mimetype);
      res.setHeader(
        'Content-disposition',
        'attachment; filename=' + obj.fileRes.originalName,
      );
    } catch (e) {
      consoleOut(e);
    }
    res.send(obj.buffer);
  }

  @Get(':file/image/type/:avatartype')
  async getImage(
    @Res({ passthrough: true }) res,
    @Param() params: AvatarTypeDTO,
  ) {
    return await this.fileResourceService.getAvatar(
      params.file,
      params.avatartype,
    );
  }
}
