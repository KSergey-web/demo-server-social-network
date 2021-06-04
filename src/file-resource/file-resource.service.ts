import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FileResAndBuffer,
  FileResource,
  FileResourceDocument,
} from './schemas/group.schema';
import * as fs from 'fs';
import * as path from 'path';
import { consoleOut } from 'src/debug';
import * as sharp from 'sharp';
import { avatarTypeEnum } from './dto/file-resource.dto';

@Injectable()
export class FileResourceService {
  constructor(
    @InjectModel(FileResource.name)
    private fileResourceModel: Model<FileResourceDocument>,
  ) {}

  readonly defImageForUser = 'default_for_user.png';
  readonly defImage = 'default_photo.png';
  readonly defImagePngType = 'image/png';

  async saveFile(file: Express.Multer.File): Promise<FileResourceDocument> {
    const fileRes: FileResource = {
      originalName: this.transliterate(file.originalname),
      mimetype: file.mimetype,
      name: (
        new Date().toJSON().slice(0, 23) + path.parse(file.originalname).ext
      )
        .replace(/\s/g, '')
        .replace(/[:]/g, ''),
    };
    const write = await fs.promises.writeFile(
      `./assets/originals/${fileRes.name}`,
      file.buffer,
    );
    const createdFile = new this.fileResourceModel(fileRes);
    await createdFile.save();
    return createdFile;
  }

  async getDefaultForUser(): Promise<FileResAndBuffer> {
    const fileRes: FileResource = {
      originalName: this.transliterate(this.defImageForUser),
      mimetype: this.defImagePngType,
      name: (
        new Date().toJSON().slice(0, 19) + path.parse(this.defImageForUser).ext
      )
        .replace(/\s/g, '')
        .replace(/[:]/g, ''),
    };
    const buffer = fs.readFileSync(
      `./assets/originals/${this.defImageForUser}`,
    );
    await fs.promises.writeFile(`./assets/originals/${fileRes.name}`, buffer);
    const createdFile = new this.fileResourceModel(fileRes);
    await createdFile.save();
    return { fileRes: createdFile, buffer };
  }

  async getDefaultPhoto(): Promise<FileResAndBuffer> {
    const fileRes: FileResource = {
      originalName: this.transliterate(this.defImage),
      mimetype: this.defImagePngType,
      name: (new Date().toJSON().slice(0, 19) + path.parse(this.defImage).ext)
        .replace(/\s/g, '')
        .replace(/[:]/g, ''),
    };
    const buffer = fs.readFileSync(`./assets/originals/${this.defImage}`);
    await fs.promises.writeFile(`./assets/originals/${fileRes.name}`, buffer);
    const createdFile = new this.fileResourceModel(fileRes);
    await createdFile.save();
    return { fileRes: createdFile, buffer };
  }

  async saveAvatarForUser(file: Express.Multer.File) {
    let avatar;
    let fileResId;
    if (file && this.isImage(file.mimetype)) {
      avatar = await this.saveFile(file);
      await this.saveImageAvarage(file.buffer, avatar);
      await this.saveImageMini(file.buffer, avatar);
      fileResId = avatar._id;
    } else {
      avatar = await this.getDefaultForUser();
      await this.saveImageAvarage(avatar.buffer as Buffer, avatar.fileRes);
      await this.saveImageMini(avatar.buffer as Buffer, avatar.fileRes);
      fileResId = avatar.fileRes._id;
    }
    return fileResId;
  }

  async saveAvatar(file: Express.Multer.File) {
    let avatar;
    let fileResId;
    if (file && this.isImage(file.mimetype)) {
      avatar = await this.saveFile(file);
      await this.saveImageAvarage(file.buffer, avatar);
      await this.saveImageMini(file.buffer, avatar);
      fileResId = avatar._id;
    } else {
      avatar = await this.getDefaultPhoto();
      await this.saveImageAvarage(avatar.buffer as Buffer, avatar.fileRes);
      await this.saveImageMini(avatar.buffer as Buffer, avatar.fileRes);
      fileResId = avatar.fileRes._id;
    }
    return fileResId;
  }

  async saveImageAvarage(
    buffer: Buffer,
    fileRes: FileResource,
  ): Promise<boolean> {
    if (this.isImage(fileRes.mimetype)) {
      await fs.promises.writeFile(
        `./assets/average/${fileRes.name}`,
        await sharp(buffer)
          .resize(200, 300)
          .toBuffer(),
      );
      return true;
    } else return false;
  }

  async saveImageMini(buffer: Buffer, fileRes: FileResource): Promise<boolean> {
    if (this.isImage(fileRes.mimetype)) {
      await fs.promises.writeFile(
        `./assets/mini/${fileRes.name}`,
        await sharp(buffer)
          .resize(53, 53)
          .toBuffer(),
      );
      return true;
    } else return false;
  }

  async saveFiles(files: Array<Express.Multer.File>) {
    let createdFiles: Array<FileResource> = [];
    for (let i = 0; i < files.length; ++i) {
      try {
        createdFiles.push(await this.saveFile(files[i]));
      } catch (e) {
        consoleOut(e, 'not saved');
      }
    }
    return createdFiles;
  }

  isImage(mimetype: string): boolean {
    const allowed_types = ['image/png', 'image/jpeg'];
    return allowed_types.indexOf(mimetype) != -1;
  }

  async getFileIfImage(resFile: FileResource): Promise<FileResAndBuffer> {
    if (this.isImage(resFile.mimetype)) {
      try {
        const buffer = (await this.getFile(resFile._id)).buffer.toString(
          'base64',
        );
        return { buffer: buffer, fileRes: resFile };
      } catch (e) {
        consoleOut(e, 'file not found');
        return { fileRes: resFile };
      }
    } else {
      return { fileRes: resFile };
    }
  }

  async getFilesIfImage(
    resFiles: Array<FileResource>,
  ): Promise<FileResAndBuffer[]> {
    let filesResAndBuffers: Array<FileResAndBuffer> = [];
    for (let i = 0; i < resFiles.length; ++i) {
      filesResAndBuffers.push(await this.getFileIfImage(resFiles[i]));
    }
    return filesResAndBuffers;
  }

  async getFile(
    fileId: string,
  ): Promise<{ buffer: Buffer; fileRes: FileResource }> {
    const fileRes = await this.fileResourceModel.findById(fileId);
    const buffer = await fs.promises.readFile(
      `./assets/originals/${fileRes.name}`,
    );
    return { buffer, fileRes };
  }

  async deleteFile(fileId: string): Promise<FileResource> {
    const fileRes = await this.fileResourceModel.findById(fileId);
    await fs.promises.unlink(`./assets/originals/${fileRes.name}`);
    await fileRes.deleteOne();
    return fileRes;
  }

  async checkFileRes(fileId: string): Promise<FileResourceDocument> {
    const fileRes = await this.fileResourceModel.findById(fileId);
    if (!fileRes) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }
    return fileRes;
  }

  checkImage(fileRes: FileResource) {
    if (!this.isImage(fileRes.mimetype)) {
      throw new HttpException('it is not image', HttpStatus.BAD_REQUEST);
    }
  }

  async getAvatar(
    fileId: string,
    type: avatarTypeEnum,
  ): Promise<{ buffer: string }> {
    const fileRes = await this.checkFileRes(fileId);
    let buffer;
    this.checkImage(fileRes);
    switch (type) {
      case avatarTypeEnum.mini: {
        buffer = await this.getMiniImage(fileRes);
        break;
      }
      case avatarTypeEnum.average: {
        buffer = await this.getAverageImage(fileRes);
        break;
      }
      case avatarTypeEnum.original: {
        buffer = await this.getOriginalImage(fileRes);
        break;
      }
    }
    return { buffer };
  }

  async getMiniImage(fileRes: FileResource) {
    const bitmap = await fs.promises.readFile(`./assets/mini/${fileRes.name}`);
    return 'data:' + fileRes.mimetype + ';base64,' + bitmap.toString('base64');
  }

  async getAverageImage(fileRes: FileResource) {
    try {
      const bitmap = await fs.promises.readFile(
        `./assets/average/${fileRes.name}`,
      );
      return (
        'data:' + fileRes.mimetype + ';base64,' + bitmap.toString('base64')
      );
    } catch (e) {
      consoleOut(e);
    }
  }
  //this.cardImageBase64 = 'data:image/png;base64,' + res.str;
  async getOriginalImage(fileRes: FileResource) {
    const bitmap = await fs.promises.readFile(
      `./assets/originals/${fileRes.name}`,
    );
    return 'data:' + fileRes.mimetype + ';base64,' + bitmap.toString('base64');
  }

  transliterate(text: string): string {
    text = text
      .replace(/\u0401/g, 'YO')
      .replace(/\u0419/g, 'I')
      .replace(/\u0426/g, 'TS')
      .replace(/\u0423/g, 'U')
      .replace(/\u041A/g, 'K')
      .replace(/\u0415/g, 'E')
      .replace(/\u041D/g, 'N')
      .replace(/\u0413/g, 'G')
      .replace(/\u0428/g, 'SH')
      .replace(/\u0429/g, 'SCH')
      .replace(/\u0417/g, 'Z')
      .replace(/\u0425/g, 'H')
      .replace(/\u042A/g, '')
      .replace(/\u0451/g, 'yo')
      .replace(/\u0439/g, 'i')
      .replace(/\u0446/g, 'ts')
      .replace(/\u0443/g, 'u')
      .replace(/\u043A/g, 'k')
      .replace(/\u0435/g, 'e')
      .replace(/\u043D/g, 'n')
      .replace(/\u0433/g, 'g')
      .replace(/\u0448/g, 'sh')
      .replace(/\u0449/g, 'sch')
      .replace(/\u0437/g, 'z')
      .replace(/\u0445/g, 'h')
      .replace(/\u044A/g, "'")
      .replace(/\u0424/g, 'F')
      .replace(/\u042B/g, 'I')
      .replace(/\u0412/g, 'V')
      .replace(/\u0410/g, 'a')
      .replace(/\u041F/g, 'P')
      .replace(/\u0420/g, 'R')
      .replace(/\u041E/g, 'O')
      .replace(/\u041B/g, 'L')
      .replace(/\u0414/g, 'D')
      .replace(/\u0416/g, 'ZH')
      .replace(/\u042D/g, 'E')
      .replace(/\u0444/g, 'f')
      .replace(/\u044B/g, 'i')
      .replace(/\u0432/g, 'v')
      .replace(/\u0430/g, 'a')
      .replace(/\u043F/g, 'p')
      .replace(/\u0440/g, 'r')
      .replace(/\u043E/g, 'o')
      .replace(/\u043B/g, 'l')
      .replace(/\u0434/g, 'd')
      .replace(/\u0436/g, 'zh')
      .replace(/\u044D/g, 'e')
      .replace(/\u042F/g, 'Ya')
      .replace(/\u0427/g, 'CH')
      .replace(/\u0421/g, 'S')
      .replace(/\u041C/g, 'M')
      .replace(/\u0418/g, 'I')
      .replace(/\u0422/g, 'T')
      .replace(/\u042C/g, "'")
      .replace(/\u0411/g, 'B')
      .replace(/\u042E/g, 'YU')
      .replace(/\u044F/g, 'ya')
      .replace(/\u0447/g, 'ch')
      .replace(/\u0441/g, 's')
      .replace(/\u043C/g, 'm')
      .replace(/\u0438/g, 'i')
      .replace(/\u0442/g, 't')
      .replace(/\u044C/g, "'")
      .replace(/\u0431/g, 'b')
      .replace(/\u044E/g, 'yu');

    return text;
  }
}
