import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './config/configuration';
import { RpcExceptionFilter } from './common/filters/grpc-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { BadRequestException, LoggerService, ValidationError, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

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
        const errorOfResponse = errors.flatMap((error) => {
          const constraints = error.constraints ?? {};
          return Object.values(constraints).map((value) => ({
            key: error.property,
            message: value,
          }));
        });
        throw new BadRequestException(errorOfResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new RpcExceptionFilter());

  app.use(cookieParser());

  const configService = app.get(ConfigService<ConfigurationType, true>);
  const appSetting = configService.get('appSettings', { infer: true });
  const port = appSetting.port;

  await app.listen(port, () => logger.log(`Server started om port ${port}`));
}
bootstrap();
