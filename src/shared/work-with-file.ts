
import * as fs from 'fs';
import * as sharp from 'sharp';
import { consoleOut } from 'src/debug';
import * as  path from 'path';

interface FileMult{
    buffer:Buffer;
    originalname:string;
    mimetype:string;
}

export const createCopyImages = async (file:FileMult): Promise<string> => {
    const newName=(new Date().toJSON().slice(0,19) + path.parse(file.originalname).ext).replace(/\s/g, '').replace(/[:]/g, "");
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