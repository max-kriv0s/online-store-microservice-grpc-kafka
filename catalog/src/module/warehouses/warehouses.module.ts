import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { ClientsModule } from '@nestjs/microservices';
import { WAREHOUSES_KAFKA_CLIENT_NAME } from './warehouses.constants';
import { warehousesKafkaConfiguration } from './warehouses-kafka.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WAREHOUSES_KAFKA_CLIENT_NAME,
        useFactory: (configService: ConfigService) => {
          return warehousesKafkaConfiguration(configService);
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [WarehousesService],
  controllers: [WarehousesController],
})
export class WarehousesModule {}
