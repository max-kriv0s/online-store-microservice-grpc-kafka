import { OrderStatus } from '../interfaces/orders-service.interface';

export class OrdersPaginateResponseDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: OrderPaginateResponse[];
}

export class OrderPaginateResponse {
  orderId: string;
  status: OrderStatus;
  date: string;
  totalSum: number;
  createdAt: string;
}
