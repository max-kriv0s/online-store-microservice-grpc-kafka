import { Module } from '@nestjs/common';
import { ProductBasketsService } from './product-baskets.service';
import { ProductBasketsController } from './product-baskets.controller';
import { ProductBasketsRepository } from './repositories/product-baskets.repository';
import { ProductBasketsMapper } from './product-baskets.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBasketEntity } from './entities/product-basket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBasketEntity])],
  providers: [ProductBasketsService, ProductBasketsRepository, ProductBasketsMapper],
  controllers: [ProductBasketsController],
  exports: [ProductBasketsService],
})
export class ProductBasketsModule {}
