import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export class InternalServerError extends RpcException {
  constructor(message: string | object = '') {
    super({ code: status.INTERNAL, message });
  }
}
