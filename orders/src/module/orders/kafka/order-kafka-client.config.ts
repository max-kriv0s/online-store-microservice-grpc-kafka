import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModuleOptionsFactory, Transport } from '@nestjs/microservices';
import { ConfigurationType } from '../../../config/configuration';

@Injectable()
export class OrderKafkaKlientConfig implements ClientsModuleOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  async createClientOptions(): Promise<ClientProvider> {
    const kafkaSettings = this.configService.get('kafkaSettings', {
      infer: true,
    });

    const { clientId, groupId } = kafkaSettings.services.orders;
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId,
          brokers: kafkaSettings.brokers,
        },
        consumer: {
          groupId,
          allowAutoTopicCreation: true,
        },
      },
    };
  }
}
