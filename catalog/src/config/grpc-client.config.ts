import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigurationType } from './configuration';

export function grpcClientConfiguration(configService: ConfigService<ConfigurationType, true>): GrpcOptions {
  const appSetting = configService.get('appSettings', { infer: true });

  return {
    transport: Transport.GRPC,
    options: {
      package: ['categories.v1', 'products.v1', 'prices.v1'],
      protoPath: [
        join(__dirname, '../module/categories/categories.proto'),
        join(__dirname, '../module/products/products.proto'),
        join(__dirname, '../module/prices/prices.proto'),
      ],
      loader: {
        includeDirs: [
          join(__dirname, '..', 'module')
        ],
      },
      url: `${appSetting.host}:${appSetting.port}`,
    },
  };
}
