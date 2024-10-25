import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionMessage = exception.getResponse() ?? 'Internal Server Error';

    let message = exceptionMessage;
    if (typeof exceptionMessage === 'object' && exceptionMessage.hasOwnProperty('message')) {
      message = (exceptionMessage as { message: string | string[] }).message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
