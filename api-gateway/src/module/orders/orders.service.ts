import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateOrderRequest,
  FindAllOrdersRequest,
  OrderRequest,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
} from './interfaces/orders-service.interface';
import { OrderResponseDto } from './dto/order-response.dto';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { ORDERS_CLIENT_NAME } from './orders.constants';
import { Metadata } from '@grpc/grpc-js';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { OrdersMapper } from './orders.mapper';
import { OrdersPaginateResponseDto } from './dto/orders-paginate-response.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
  private ordersService: OrdersServiceClient;

  constructor(
    @Inject(ORDERS_CLIENT_NAME) private client: ClientGrpc,
    private readonly productsService: ProductsService,
    private readonly mapper: OrdersMapper,
  ) {}

  onModuleInit() {
    this.ordersService = this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
  }

  private getMetadate(): Metadata {
    return new Metadata();
  }

  async createOrder(dto: CreateOrderRequest): Promise<OrderResponseDto> {
    const order = await firstValueFrom(
      this.ordersService
        .createOrder(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    const productsIds = order.items.map((item) => item.productId);
    const products = await this.productsService.getProductsByIds(productsIds);
    return this.mapper.map(order, products);
  }

  async canceledOrder(dto: OrderRequest): Promise<void> {
    await firstValueFrom(
      this.ordersService
        .canceledOrder(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async shipOrder(dto: OrderRequest): Promise<void> {
    await firstValueFrom(
      this.ordersService
        .shipOrder(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findOrder(dto: OrderRequest): Promise<OrderResponseDto> {
    const order = await firstValueFrom(
      this.ordersService
        .findOrder(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    const productsIds = order.items.map((item) => item.productId);
    const products = await this.productsService.getProductsByIds(productsIds);
    return this.mapper.map(order, products);
  }

  async findAllOrders(params: FindAllOrdersRequest): Promise<OrdersPaginateResponseDto> {
    const orders = await firstValueFrom(
      this.ordersService
        .findAllOrders(params, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );

    return this.mapper.mapOrdersPaginate(orders);
  }
}
