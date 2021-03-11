import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { consoleOut } from '../debug';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const reqInfo = {
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      bodyreq: request.body,
      paramreq: request.params,
      queryreq: request.query,
      cookiesreq: request.cookies,
    };
    consoleOut(reqInfo,"Request info")
    return next
      .handle()
      .pipe(tap(value => consoleOut(value, "Response body")));
  }
}
