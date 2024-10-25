import { ConfigService } from '@nestjs/config';
import { AuthServiceSettings, ConfigurationType } from '../../config/configuration';
import { ACCOUNT_PACKAGE } from './auth.constants';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthServiceConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    const authServiceSetings: AuthServiceSettings = this.configService.get('authServiceSettings', {
      infer: true,
    });

    return {
      transport: Transport.GRPC,
      options: {
        url: authServiceSetings.url,
        package: ACCOUNT_PACKAGE,
        protoPath: join(__dirname, '../auth/auth.proto'),
      },
    };
  }
}
