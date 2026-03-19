import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../modules/auth/auth-utils/current-user.interface';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CurrentUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
