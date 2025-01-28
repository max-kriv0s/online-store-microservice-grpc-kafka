import { Injectable } from '@nestjs/common';
import { ItemResponse, OrderResponseDto } from './dto/order-response.dto';
import {
  FindAllOrderResponse,
  FindAllOrdersResponse,
  Item,
  OrderResponse,
} from './interfaces/orders-service.interface';
import { ProductsObject } from '../products/interfaces/products.interface';
import fns from 'date-fns';
import { OrderPaginateResponse, OrdersPaginateResponseDto } from './dto/orders-paginate-response.dto';

@Injectable()
export class OrdersMapper {
  map(order: OrderResponse, products: ProductsObject): OrderResponseDto {
    return {
      orderId: order.orderId,
      status: order.status,
      date: this.getDate(order.date),
      totalSum: order.totalSum,
      customerId: order.customerId,
      items: order.items.map((item) => this.mapItem(item, products)),
      createdAt: this.getDate(order.createdAt),
    };
  }

  mapItem(item: Item, products: ProductsObject): ItemResponse {
    const product = products[item.productId];
    return {
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      sum: item.sum,
    };
  }

  getDate(date: number): string {
    return fns.format(new Date(Number(date)), 'yyyy-MM-dd HH:mm:ss');
  }

  mapOrdersPaginate(paginateOrders: FindAllOrdersResponse): OrdersPaginateResponseDto {
    const { pagesCount, page, pageSize, totalCount, items } = paginateOrders;
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map((item) => this.mapOrderPaginate(item)),
    };
  }

  mapOrderPaginate(order: FindAllOrderResponse): OrderPaginateResponse {
    return {
      orderId: order.orderId,
      status: order.status,
      date: this.getDate(order.date),
      totalSum: order.totalSum,
      createdAt: this.getDate(order.createdAt),
    };
  }
}
