import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ORDERS_CLIENT_NAME } from './orders.constants';
import { OrdersServiceConfig } from './orders-service.config';
import { ProductsModule } from '../products/products.module';
import { OrdersMapper } from './orders.mapper';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ORDERS_CLIENT_NAME,
        useClass: OrdersServiceConfig,
      },
    ]),
    ProductsModule,
    AuthModule,
  ],
  providers: [OrdersService, OrdersMapper],
  controllers: [OrdersController],
})
export class OrdersModule {}
