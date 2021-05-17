import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { consoleOut } from 'src/debug';
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
    //consoleOut(request.cookies);
    return request.cookies[cookiesEnum.organizationId];
  },
);

// Helper
const StringIsNumber = value => isNaN(Number(value)) === false;

// Turn enum into array
export function enumToArray(enumme) {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map(key => enumme[key]);
}
