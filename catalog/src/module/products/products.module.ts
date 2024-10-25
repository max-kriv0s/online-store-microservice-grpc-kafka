import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsMapper } from './products.mapper';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), PricesModule],
  providers: [ProductsService, ProductsRepository, ProductsMapper],
  controllers: [ProductsController],
})
export class ProductsModule {}
