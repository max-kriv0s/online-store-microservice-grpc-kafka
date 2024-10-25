import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './config/configuration';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcClientConfiguration } from './config/grpc-client.config';
import { LoggerService, ValidationError, ValidationPipe } from '@nestjs/common';
import { getErrorOfResponse } from './common/utils';
import { BadRequestError } from './common/exceptions/bad-request.error';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorOfResponse = getErrorOfResponse(errors);
        throw new BadRequestError(errorOfResponse);
      },
    }),
  );

  app.useGlobalFilters(new GrpcExceptionFilter());

  const configService = app.get(ConfigService<ConfigurationType, true>);
  const appSetting = configService.get('appSettings', { infer: true });

  const grpcConfig = grpcClientConfiguration(configService);
  app.connectMicroservice<MicroserviceOptions>(grpcConfig, { inheritAppConfig: true });
  app.startAllMicroservices();

  logger.log(`${appSetting.serviceName} started ${appSetting.host}:${appSetting.port}`);
}
bootstrap();
