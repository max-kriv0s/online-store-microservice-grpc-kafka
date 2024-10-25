import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class BadRequestError extends RpcException {
  constructor(message: string | object) {
    super({ code: status.INVALID_ARGUMENT, message: JSON.stringify(message) });
  }
}
