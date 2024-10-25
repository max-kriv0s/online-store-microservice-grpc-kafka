import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { CategoriesServiceSettings, ConfigurationType } from '../../config/configuration';
import { CATEGORIES_PACKAGE } from './categories.constants';
import { join } from 'path';

@Injectable()
export class CategoriesServiceConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  async createClientOptions(): Promise<ClientProvider> {
    const categoriesServiceSettings: CategoriesServiceSettings = this.configService.get('categoriesServiceSettings', {
      infer: true,
    });

    return {
      transport: Transport.GRPC,
      options: {
        url: categoriesServiceSettings.url,
        package: CATEGORIES_PACKAGE,
        protoPath: join(__dirname, 'categories.proto'),
      },
    };
  }
}
