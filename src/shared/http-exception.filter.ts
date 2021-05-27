import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { consoleOut } from 'src/debug';
import * as fs from 'fs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    let details: any =
      exception.getResponse != undefined ? exception.getResponse() : exception;
    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message || null
          : 'Internal server error',
      details: details?.message,
      bodyreq: request.body,
      paramreq: request.params,
      queryreq: request.query,
      cookiesreq: request.cookies,
    };
    const reqInfo = {
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      bodyreq: request.body,
      paramreq: request.params,
      queryreq: request.query,
      cookiesreq: request.cookies,
    };
    if (status == 500) {
      fs.writeFile(
        'logFile.json',
        ' //reqinfo \n' + JSON.stringify(reqInfo) + ';\n',
        { flag: 'a+' },
        err => {},
      );
      fs.writeFile(
        'logFile.json',
        ' //exeption info \n' + JSON.stringify(exception) + ';\n',
        { flag: 'a+' },
        err => {},
      );
    } else {
      fs.writeFile(
        'logFile.json',
        ' //error info \n' + JSON.stringify(errorResponse) + ';\n',
        { flag: 'a+' },
        err => {},
      );
    }
    response.status(status).json(errorResponse);
  }
}
