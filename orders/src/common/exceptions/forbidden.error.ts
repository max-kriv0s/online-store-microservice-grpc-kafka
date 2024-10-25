import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export const FORBIDDEN_DEFAULT_MESSAGE = 'Access denied';

export class ForbiddenError extends RpcException {
  constructor(message: string | object = FORBIDDEN_DEFAULT_MESSAGE) {
    super({ code: status.PERMISSION_DENIED, message });
  }
}
