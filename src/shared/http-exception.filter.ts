import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { consoleOut } from 'src/debug';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    // consoleOut(request,"req");
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

    response.status(status).json(errorResponse);
  }
}
