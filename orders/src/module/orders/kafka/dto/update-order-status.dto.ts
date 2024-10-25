import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrderStatus } from '../../enums/order-status.enum';
import { UpdateOrderStatus } from '../interfaces/update-order-status.interface';

export class UpdateOrderStatusDto implements UpdateOrderStatus {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  newStatus: OrderStatus;
}
