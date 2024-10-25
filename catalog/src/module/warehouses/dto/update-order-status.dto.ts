import { WarehousesOrderStatus } from '../enums/warehouses-order-status.enum';

export class UpdateOrderStatusDto {
  orderId: string;
  newStatus: WarehousesOrderStatus;
}
