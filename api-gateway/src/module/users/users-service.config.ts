import { ConfigService } from '@nestjs/config';
import { ConfigurationType, UsersServiceSettings } from '../../config/configuration';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { USERS_PACKAGE } from './users.constants';

@Injectable()
export class UsersServiceConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    const usersServiceSetings: UsersServiceSettings = this.configService.get('usersServiceSettings', {
      infer: true,
    });

    return {
      transport: Transport.GRPC,
      options: {
        url: usersServiceSetings.url,
        package: USERS_PACKAGE,
        protoPath: join(__dirname, 'users.proto'),
      },
    };
  }
}
