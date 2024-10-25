import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigurationType } from './configuration';

export function grpcClientConfiguration(configService: ConfigService<ConfigurationType, true>): GrpcOptions {
  const appSetting = configService.get('appSettings', { infer: true });

  return {
    transport: Transport.GRPC,
    options: {
      package: ['auth.v1', 'users.v1'],
      protoPath: [join(__dirname, '../module/auth/auth.proto'), join(__dirname, '../module/users/users.proto')],
      loader: {
        includeDirs: [join(__dirname, '../module/auth/auth.proto'), join(__dirname, '../module/users/users.proto')],
      },
      url: `${appSetting.host}:${appSetting.port}`,
    },
  };
}
