import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { ConfigurationType, ProductsServiceSettings } from '../../config/configuration';
import { join } from 'path';
import { PRODUCTS_PACKAGE } from './products.constants';

@Injectable()
export class ProductsServiceConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  async createClientOptions(): Promise<ClientProvider> {
    const productsServiceSettings: ProductsServiceSettings = this.configService.get('productsServiceSettings', {
      infer: true,
    });

    return {
      transport: Transport.GRPC,
      options: {
        url: productsServiceSettings.url,
        package: PRODUCTS_PACKAGE,
        protoPath: join(__dirname, 'products.proto'),
      },
    };
  }
}
