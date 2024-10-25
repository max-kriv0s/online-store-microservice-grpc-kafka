import { SortQuery } from '../../../common/pagination';
import { OrderStatus } from '../enums/order-status.enum';

export type StatusTransition = Record<string, OrderStatus[]>;

export interface SearchOrdersParams {
  ids?: string[];
  pageNumber?: number;
  pageSize?: number;
  skip?: number;
  sortBy?: SortQuery[];
  customerId: string;
}
