import { OrderStatus } from '../interfaces/orders-service.interface';

export class OrderResponseDto {
  orderId: string;
  status: OrderStatus;
  date: string;
  totalSum: number;
  customerId: string;
  items: ItemResponse[];
  createdAt: string;
}

export class ItemResponse {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  sum: number;
}
