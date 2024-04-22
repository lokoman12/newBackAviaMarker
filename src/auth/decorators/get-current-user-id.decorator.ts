import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    console.log('Get current user');
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);