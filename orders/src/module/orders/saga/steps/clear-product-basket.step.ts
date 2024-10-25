import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../../entities/order.entity';
import { Step } from './step';
import { ProductBasketsService } from '../../../product-baskets/product-baskets.service';

@Injectable()
export class ClearProductBasketStep extends Step<OrderEntity, void> {
  constructor(private readonly productBasketsService: ProductBasketsService) {
    super();
  }

  async invoke(order: OrderEntity): Promise<void> {
    await this.productBasketsService.clearTheBasket({ userId: order.customerId });
  }
  async withCompenstion(params: OrderEntity): Promise<void> {}
}
