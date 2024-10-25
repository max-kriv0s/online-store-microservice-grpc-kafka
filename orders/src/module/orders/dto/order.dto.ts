import { IsNotEmpty, IsUUID } from 'class-validator';
import { OrderRequest } from '../interfaces/orders.interface';

export class OrderDto implements OrderRequest {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;
}
