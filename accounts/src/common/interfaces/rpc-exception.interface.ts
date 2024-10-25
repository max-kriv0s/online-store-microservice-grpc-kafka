import { status } from '@grpc/grpc-js';

export interface IRpcError {
  code: status;
  message: string;
}
