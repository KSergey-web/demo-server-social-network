import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileResource, FileResourceDocument } from './schemas/group.schema';
import * as fs from 'fs';
import * as  path from 'path';
import { consoleOut } from 'src/debug';

@Injectable()
export class FileResourceService {
    constructor(
        @InjectModel(FileResource.name)
        private fileResourceModel: Model<FileResourceDocument>,
      ) {}

      async saveFile(file: Express.Multer.File){
            const fileRes: FileResource = {
                originalName: this.transliterate(file.originalname),
                mimetype:file.mimetype,
                name: (new Date().toJSON().slice(0,19) + path.parse(file.originalname).ext).replace(/\s/g, '').replace(/[:]/g, "")
            }
            const write = await fs.promises.writeFile(
                `./assets/originals/${fileRes.name}`,
                file.buffer
              );
            const createdFile = new this.fileResourceModel(fileRes);
            await createdFile.save();
            return createdFile;
      }

      async getFile(fileId: string): Promise<{buffer:Buffer, fileRes:FileResource}>{
          const fileRes = await this.fileResourceModel.findById(fileId);
          const buffer = await fs.promises.readFile(`./assets/originals/${fileRes.name}`);
          consoleOut({buffer, fileRes});
          return {buffer, fileRes}
      }

      async deleteFile(fileId: string): Promise<FileResource>{
        const fileRes = await this.fileResourceModel.findById(fileId);
        await fs.promises.unlink(`./assets/originals/${fileRes.name}`);
        await fileRes.deleteOne();
        consoleOut(fileRes);
        return fileRes;
    }

      transliterate(text: string) :string {

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
    };

}
