import { ArgumentsHost, Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { Metadata, status } from '@grpc/grpc-js';
import { ErrorStatusMapper } from '../mappers/error-status.mapper';

interface IRpcException {
  code: status;
  details: string;
  metadata: Metadata;
}

@Catch(RpcException)
export class RpcExceptionFilter implements RpcExceptionFilter {
  mapper: ErrorStatusMapper;
  constructor() {
    this.mapper = new ErrorStatusMapper();
  }

  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError() as IRpcException;

    const message = this.getMessage(error.details);
    const status = this.mapper.grpcToHttpStatus(error.code);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }

  private getMessage(details: string) {
    try {
      return JSON.parse(details);
    } catch {
      return details;
    }
  }
}
