import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
export class ConflictError extends RpcException {
  constructor(message: string | object) {
    super({ code: status.ALREADY_EXISTS, message });
  }
}
