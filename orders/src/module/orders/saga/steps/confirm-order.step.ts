import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../../entities/order.entity';
import { Step } from './step';
import { OrderRepository } from '../../repositories/orders.repository';

@Injectable()
export class ConfirmOrderStep extends Step<OrderEntity, void> {
  constructor(private readonly ordersRepository: OrderRepository) {
    super();
    this.name = 'Confirm Order Step';
  }

  async invoke(order: OrderEntity): Promise<void> {
    order.confirm();
    await this.ordersRepository.updateOrderStatus(order);
  }

  async withCompenstion(order: OrderEntity): Promise<void> {
    order.cancel();
    await this.ordersRepository.updateOrderStatus(order);
  }
}
