import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class ForbiddenError extends RpcException {
  constructor(message: string | object = 'Access denied') {
    super({ code: status.PERMISSION_DENIED, message });
  }
}
