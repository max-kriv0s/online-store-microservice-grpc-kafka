import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { ConfigurationType, OrdersServiceSettings } from '../../config/configuration';
import { join } from 'path';
import { ORDERS_PACKAGE } from './orders.constants';

@Injectable()
export class OrdersServiceConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  async createClientOptions(): Promise<ClientProvider> {
    const ordersServiceSettings: OrdersServiceSettings = this.configService.get('ordersServiceSettings', {
      infer: true,
    });
    return {
      transport: Transport.GRPC,
      options: {
        url: ordersServiceSettings.url,
        package: ORDERS_PACKAGE,
        protoPath: join(__dirname, 'orders.proto'),
      },
    };
  }
}
