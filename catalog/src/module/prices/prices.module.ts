import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { PriceEntity } from './entities/price.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesRepository } from './repositories/prices.repository';
import { PricesMapper } from './prices.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([PriceEntity])],
  providers: [PricesService, PricesRepository, PricesMapper],
  controllers: [PricesController],
  exports: [PricesService],
})
export class PricesModule {}
