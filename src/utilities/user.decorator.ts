import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { cookiesEnum } from 'src/enums/cookies.enum';
import { UserDocument } from 'src/user/schemas/user.schema';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const Organization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies[cookiesEnum.organizationId];
  },
);
