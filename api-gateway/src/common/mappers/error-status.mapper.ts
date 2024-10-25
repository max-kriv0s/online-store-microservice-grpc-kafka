import { HttpStatus, Injectable } from '@nestjs/common';
import { status } from '@grpc/grpc-js';

@Injectable()
export class ErrorStatusMapper {
  private matchingGrpcStatusToHttpStatuses = new Map<status, HttpStatus>()
    .set(status.INVALID_ARGUMENT, HttpStatus.BAD_REQUEST)
    .set(status.ALREADY_EXISTS, HttpStatus.CONFLICT)
    .set(status.INTERNAL, HttpStatus.INTERNAL_SERVER_ERROR)
    .set(status.NOT_FOUND, HttpStatus.NOT_FOUND)
    .set(status.UNAUTHENTICATED, HttpStatus.UNAUTHORIZED)
    .set(status.PERMISSION_DENIED, HttpStatus.FORBIDDEN);

  grpcToHttpStatus(status: status): HttpStatus {
    const httpStatus = this.matchingGrpcStatusToHttpStatuses.get(status);
    if (httpStatus) {
      return httpStatus;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
