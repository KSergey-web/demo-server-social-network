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
import { createCopyImages } from './shared/work-with-file';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


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

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async file(@UploadedFile() file: Express.Multer.File) {
  //   createCopyImages(file);
  //   return;
  // }

}
