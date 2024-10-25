import { Inject, Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepository } from './repositories/orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrdersMapper } from './orders.mapper';
import { OrderSagaSteps } from './saga/steps';
import { CreateOrderSaga } from './saga/create-order.saga';
import { ClientsModule } from '@nestjs/microservices';
import { OrderKafkaKlientConfig } from './kafka/order-kafka-client.config';
import { ORDERS_KAFKA_CLIENT_NAME } from './orders.constants';
import { ProductBasketsModule } from '../product-baskets/product-baskets.module';
import { OrdersKafkaController } from './kafka/orders-kafka.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    ClientsModule.registerAsync([
      {
        name: ORDERS_KAFKA_CLIENT_NAME,
        useClass: OrderKafkaKlientConfig,
      },
    ]),
    ProductBasketsModule,
  ],
  controllers: [OrdersController, OrdersKafkaController],
  providers: [OrdersService, OrderRepository, OrdersMapper, CreateOrderSaga, ...OrderSagaSteps],
})
export class OrdersModule {}
