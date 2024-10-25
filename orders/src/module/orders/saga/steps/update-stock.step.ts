import { OrderEntity } from '../../entities/order.entity';
import { Step } from './step';
import { OrdersMapper } from '../../orders.mapper';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderKafkaTopic } from '../../kafka/enums/orders-kafka-topic.enum';
import { OrderMessageResponse } from '../../kafka/interfaces/order-message-response.interface';
import { ORDERS_KAFKA_CLIENT_NAME } from '../../orders.constants';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, tap } from 'rxjs';

@Injectable()
export class UpdateStockStep extends Step<OrderEntity, void> implements OnModuleInit {
  constructor(
    @Inject(ORDERS_KAFKA_CLIENT_NAME) private ordersClient: ClientKafka,
    private readonly mapper: OrdersMapper,
  ) {
    super();
    this.name = 'Update Stock Step';
  }

  async onModuleInit() {
    this.ordersClient.subscribeToResponseOf(OrderKafkaTopic.OrderReduceStock);
    this.ordersClient.subscribeToResponseOf(OrderKafkaTopic.OrderRestockStock);
    await this.ordersClient.connect();
  }

  async invoke(order: OrderEntity): Promise<void> {
    const message = this.mapper.getOrderMessage(order);
    const response = await lastValueFrom(
      this.ordersClient.send<OrderMessageResponse>(OrderKafkaTopic.OrderReduceStock, message),
    );
    if (!response.success) {
      throw new Error(response.error);
    }
  }

  async withCompenstion(order: OrderEntity): Promise<void> {
    const message = this.mapper.getOrderMessage(order);
    const response = await lastValueFrom(
      this.ordersClient.send<OrderMessageResponse>(OrderKafkaTopic.OrderRestockStock, message),
    );
    if (!response.success) {
      throw new Error(response.error);
    }
  }
}
