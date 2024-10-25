import { OrderStatus } from '../../enums/order-status.enum';

export interface UpdateOrderStatus {
  orderId: string;
  newStatus: OrderStatus;
}
