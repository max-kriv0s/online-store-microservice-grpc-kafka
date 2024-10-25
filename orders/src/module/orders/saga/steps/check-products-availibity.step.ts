import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OrderKafkaTopic } from '../../kafka/enums/orders-kafka-topic.enum';
import { OrderEntity } from '../../entities/order.entity';
import { OrdersMapper } from '../../orders.mapper';
import { Step } from './step';
import { OrderMessageResponse } from '../../kafka/interfaces/order-message-response.interface';
import { OrderRepository } from '../../repositories/orders.repository';
import { ClientKafka } from '@nestjs/microservices';
import { ORDERS_KAFKA_CLIENT_NAME } from '../../orders.constants';
import { lastValueFrom, tap } from 'rxjs';

@Injectable()
export class CheckProductsAvailibityStep extends Step<OrderEntity, void> implements OnModuleInit {
  readonly orderCreateReplyTopic: string = `${OrderKafkaTopic.OrderCreate}.reply`;

  constructor(
    @Inject(ORDERS_KAFKA_CLIENT_NAME) private ordersClient: ClientKafka,
    private readonly mapper: OrdersMapper,
    private readonly ordersRepository: OrderRepository,
  ) {
    super();
    this.name = 'Check Products Availbility Step';
  }

  async invoke(order: OrderEntity): Promise<void> {
    const message = this.mapper.getOrderMessage(order);
    const response = await lastValueFrom(this.ordersClient.send(OrderKafkaTopic.OrderCreate, message));
    if (!response.success) {
      throw new Error(response.error);
    }
  }

  async withCompenstion(order: OrderEntity): Promise<void> {
    order.cancel();
    await this.ordersRepository.updateOrderStatus(order);
  }

  async onModuleInit() {
    this.ordersClient.subscribeToResponseOf(OrderKafkaTopic.OrderCreate);
    await this.ordersClient.connect();
  }
}
