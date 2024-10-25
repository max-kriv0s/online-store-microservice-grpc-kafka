import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';
import { LoggerService, ValidationError, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './config/configuration';
import { grpcClientConfiguration } from './config/grpc-client.config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getErrorOfResponse } from './common/utils';
import { BadRequestError } from './common/exceptions/bad-request.error';
import { warehousesKafkaConfiguration } from './module/warehouses/warehouses-kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
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

  app.useGlobalFilters(new GrpcExceptionFilter(logger));

  const configService = app.get(ConfigService<ConfigurationType, true>);
  const appSetting = configService.get('appSettings', { infer: true });

  const grpcConfig = grpcClientConfiguration(configService);

  app.connectMicroservice<MicroserviceOptions>(grpcConfig, { inheritAppConfig: true });
  app.connectMicroservice<MicroserviceOptions>(warehousesKafkaConfiguration(configService), { inheritAppConfig: true });

  await app.init();
  await app.startAllMicroservices();

  logger.log(`${appSetting.serviceName} started ${appSetting.host}:${appSetting.port}`);
}
bootstrap();
