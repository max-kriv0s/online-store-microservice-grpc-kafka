import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
export class UnauthorizedError extends RpcException {
  constructor(message: string | object) {
    super({ code: status.UNAUTHENTICATED, message });
  }
}
