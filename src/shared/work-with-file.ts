
import * as fs from 'fs';
import * as sharp from 'sharp';
import { consoleOut } from 'src/debug';
import * as  path from 'path';
import { avatarTypeEnum } from './shared.dto';

interface FileMult{
    buffer:Buffer;
    originalname:string;
    mimetype:string;
}

export const createCopyImages = async (file:FileMult): Promise<string> => {
    const newName=(new Date().toJSON().slice(0,19) + path.parse(file.originalname).ext).replace(/\s/g, '').replace(/[:]/g, "");;
    try {
    fs.writeFile(
      `./assets/originals/${newName}`,
      file.buffer,(err)=>{}
    );
    fs.writeFile(
        `./assets/average/${newName}`,
        (await sharp(file.buffer)
    .resize(200, 300).toBuffer()),(err)=>{ }
      );
    fs.writeFile(
        `./assets/mini/${newName}`,
        (await sharp(file.buffer)
    .resize(53, 53).toBuffer()),
    (err)=>{ }
      );
    }
    catch (e) {
        consoleOut(e,'eee');
    }
    return newName;
  }

  export const getMiniAvatar = (fileName: string) => {
    const bitmap = fs.readFileSync(`./assets/mini/${fileName}`);    
    return ('data:image/'+path.parse(fileName).ext.replace('.','')+';base64,')+bitmap.toString('base64')
  }

  export const getAverageAvatar = (fileName: string) => {
    const bitmap = fs.readFileSync(`./assets/average/${fileName}`);    
    return ('data:image/'+path.parse(fileName).ext.replace('.','')+';base64,')+bitmap.toString('base64')
  }
  //this.cardImageBase64 = 'data:image/png;base64,' + res.str;
  export const getOriginalAvatar = (fileName: string) => {
    const bitmap = fs.readFileSync(`./assets/originals/${fileName}`);    
    return ('data:image/'+path.parse(fileName).ext.replace('.','')+';base64,')+bitmap.toString('base64')
  }

  export const getAvatar = (name: string,type:avatarTypeEnum): string => {
    switch (type) {
      case avatarTypeEnum.mini:{ 
        return getMiniAvatar(name);
      }
      case avatarTypeEnum.average:{ 
        return getAverageAvatar(name);
      }
      case avatarTypeEnum.original:{ 
        return getOriginalAvatar(name);
      }
    }
    return name;
  }
