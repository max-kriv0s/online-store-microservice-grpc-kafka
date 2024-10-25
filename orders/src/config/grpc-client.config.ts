import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigurationType } from './configuration';

export function grpcClientConfiguration(configService: ConfigService<ConfigurationType, true>): GrpcOptions {
  const appSetting = configService.get('appSettings', { infer: true });

  return {
    transport: Transport.GRPC,
    options: {
      package: ['orders.v1', 'product.baskets.v1'],
      protoPath: [
        join(__dirname, '../module/orders/orders.proto'),
        join(__dirname, '../module/product-baskets/product-baskets.proto'),
      ],
      loader: {
        includeDirs: [join(__dirname, '..', 'module')],
      },
      url: `${appSetting.host}:${appSetting.port}`,
    },
  };
}
