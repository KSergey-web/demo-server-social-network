import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/user/interfaces/user.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) : IUser=> {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);