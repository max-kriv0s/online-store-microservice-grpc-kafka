import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class NotFoundError extends RpcException {
  constructor(message: string | object) {
    super({ code: status.NOT_FOUND, message });
  }
}
