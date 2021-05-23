import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as fs from 'fs';
import { consoleOut } from './debug';
import * as sharp from 'sharp';
import { createCopyImages, getAvatar } from './shared/work-with-file';
import { AvatarTypeDTO } from './shared/shared.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('file')
  getAvatar(@Body() params: AvatarTypeDTO){
    return { avatar:getAvatar(params.fileName, params.avatartype) };
  }

  @Get('filetest')
  getFile(@Res({ passthrough: true }) res){
    const bitmap = fs.readFileSync(`./assets/average/default.png`);    
var filename = 'default.png';
var mimetype = 'image/png';
res.setHeader('Content-Type', mimetype);
res.setHeader('Content-disposition','attachment; filename='+filename);
res.send( bitmap );
//     const bitmap = fs.readFileSync(`./assets/average/default.png`);    
//     return bitmap;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async file(@UploadedFile() file: Express.Multer.File) {
    createCopyImages(file);
    return;
  }

  toArrayBuffer(buf):ArrayBuffer {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

}
