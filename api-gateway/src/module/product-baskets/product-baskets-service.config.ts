import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { ConfigurationType, ProductsBasketsServiceSettings } from '../../config/configuration';
import { PRODUCT_BASKETS_PACKAGE } from './product-baskets.constants';
import { join } from 'path';

@Injectable()
export class ProductBasketsServiceConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  async createClientOptions(): Promise<ClientProvider> {
    const productsBasketsServiceSettings: ProductsBasketsServiceSettings = this.configService.get(
      'productsBasketsServiceSettings',
      { infer: true },
    );

    return {
      transport: Transport.GRPC,
      options: {
        url: productsBasketsServiceSettings.url,
        package: PRODUCT_BASKETS_PACKAGE,
        protoPath: join(__dirname, 'product-baskets.proto'),
      },
    };
  }
}
