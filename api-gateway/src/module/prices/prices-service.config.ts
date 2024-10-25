import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { ConfigurationType, PricesServiceSettings } from '../../config/configuration';
import { join } from 'path';
import { PRICES_PACKAGE } from './prices.constants';

@Injectable()
export class PricesServiceConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  async createClientOptions(): Promise<ClientProvider> {
    const pricesServiceSettings: PricesServiceSettings = this.configService.get('pricesServiceSettings', {
      infer: true,
    });

    return {
      transport: Transport.GRPC,
      options: {
        url: pricesServiceSettings.url,
        package: PRICES_PACKAGE,
        protoPath: join(__dirname, 'prices.proto'),
      },
    };
  }
}
