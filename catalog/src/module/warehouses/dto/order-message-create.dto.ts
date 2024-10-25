import { IsNotEmpty, IsUUID } from 'class-validator';
import { OrderMessageCreate } from '../interfaces/order-message-create.interface';

export class OrderMessageCreateDto implements OrderMessageCreate {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;
  date: Date;
  totalSum: number;
  customerId: string;
  items: ItemDto[];
  createdAt: Date;
}

export class ItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  sum: number;
}
