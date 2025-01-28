import { Module } from '@nestjs/common';
import { ProductBasketsService } from './product-baskets.service';
import { ProductBasketsController } from './product-baskets.controller';
import { ClientsModule } from '@nestjs/microservices';
import { PRODUCT_BASKETS_CLIENT_NAME } from './product-baskets.constants';
import { ProductBasketsServiceConfig } from './product-baskets-service.config';
import { AuthModule } from '../auth/auth.module';
import { ProductBasketsMapper } from './product-baskets.mapper';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRODUCT_BASKETS_CLIENT_NAME,
        useClass: ProductBasketsServiceConfig,
      },
    ]),
    AuthModule,
    ProductsModule,
  ],
  providers: [ProductBasketsService, ProductBasketsMapper],
  controllers: [ProductBasketsController],
})
export class ProductBasketsModule {}
