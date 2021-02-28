import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { consoleOut } from 'src/debug';
import { colorEnum } from '../enums/color.enum';

@Injectable()
export class ColorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('MDDDDDDDDDDDDD');
    const color = req.body.color;
    if (color == colorEnum.green) {
      if (!req.body.date) {
        delete req.body.date;
        consoleOut(req.body.date, 'delete date from req');
      }
    } else if (color == colorEnum.orange) {
      if (!req.body.date) {
        throw new HttpException(`Date is undefined`, HttpStatus.BAD_REQUEST);
      }
      if (!(req.body.date > new Date())) {
        throw new HttpException(
          `Date should be future`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (color == colorEnum.red) {
      throw new HttpException(`Red color is forbidden`, HttpStatus.BAD_REQUEST);
    }
    next();
  }
}
