import { Injectable } from '@nestjs/common';
import { FindAllOrderResponse, Item, OrderResponse } from './interfaces/orders.interface';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { KafkaCreateOrderMessage } from './kafka/interfaces/kafka-messages.interface';

@Injectable()
export class OrdersMapper {
  map(order: OrderEntity): OrderResponse {
    const orderResponse: OrderResponse = {
      orderId: order.id,
      status: order.status,
      date: order.date.getTime(),
      totalSum: order.totalSum,
      customerId: order.customerId,
      items: order.orderItems.map((item) => this.orderItemMap(item)),
      createdAt: order.createdAt.getTime(),
    };
    return orderResponse;
  }

  mapAll(orders: OrderEntity[]): FindAllOrderResponse[] {
    return orders.map((order) => this.map(order));
  }

  private orderItemMap(orderItem: OrderItemEntity): Item {
    const itemResponse: Item = {
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice,
      sum: orderItem.sum,
    };
    return itemResponse;
  }

  getOrderMessage(order: OrderEntity): KafkaCreateOrderMessage {
    return {
      orderId: order.id,
      date: order.date,
      totalSum: order.totalSum,
      customerId: order.customerId,
      items: order.orderItems.map((item) => this.orderItemMap(item)),
      createdAt: order.createdAt,
    };
  }
}
