import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayloadDto } from '../dto/token.payload.dto';

export const CurrentUserId = createParamDecorator((data: unknown, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest();
  const user = request.user as Pick<AccessTokenPayloadDto, 'userId'>;
  return user.userId;
});
