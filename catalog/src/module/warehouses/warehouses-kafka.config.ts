import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ConfigurationType } from '../../config/configuration';

export function warehousesKafkaConfiguration(configService: ConfigService<ConfigurationType, true>): KafkaOptions {
  const kafkaSettings = configService.get('kafkaSettings', { infer: true });

  const { clientId, groupId } = kafkaSettings.services.warehouses;
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers: kafkaSettings.brokers,
      },
      consumer: {
        groupId,
      },
    },
  };
}
