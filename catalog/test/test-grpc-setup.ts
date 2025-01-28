import { INestMicroservice, LoggerService, ValidationError, ValidationPipe } from '@nestjs/common';
import { ClientGrpcProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { join } from 'path';
import { getErrorOfResponse } from '@/common/utils';
import { BadRequestError } from '@/common/exceptions/bad-request.error';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GrpcExceptionFilter } from '@/common/filters/grpc-exception.filter';

const GRPC_PACKAGES = ['categories.v1', 'products.v1', 'prices.v1'];

const GRPC_PROTO_PATH = [
  join(__dirname, '../src/module/categories/categories.proto'),
  join(__dirname, '../src/module/products/products.proto'),
  join(__dirname, '../src/module/prices/prices.proto'),
];

let microservice: INestMicroservice;
let grpcProxy: ClientGrpcProxy;
let loggerMock: jest.SpyInstance;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      ClientsModule.register([
        {
          name: 'client',
          transport: Transport.GRPC,
          options: {
            url: '0.0.0.0:50050',
            package: GRPC_PACKAGES,
            protoPath: GRPC_PROTO_PATH,
          },
        },
      ]),
    ],
  }).compile();

  microservice = moduleFixture.createNestMicroservice({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50050',
      package: GRPC_PACKAGES,
      protoPath: GRPC_PROTO_PATH,
    },
    loader: {
      includeDirs: [join(__dirname, '../src', 'module')],
    },
    autoFlushLogs: true,
    bufferLogs: true,
  });
  const logger = await microservice.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);

  loggerMock = jest.spyOn(logger, 'error').mockImplementation(() => {});

  microservice.useLogger(logger);
  microservice.useGlobalPipes(
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
  microservice.useGlobalFilters(new GrpcExceptionFilter(logger));
  // Start gRPC microservice
  await microservice.init();
  await microservice.listen();
  grpcProxy = microservice.get('client');
});

afterAll(async () => {
  loggerMock.mockClear();
  await microservice.close();
});

export { microservice, grpcProxy };
