import { Controller } from '@nestjs/common';
import {
  FindAllOrdersResponse,
  OrderResponse,
  ORDERS_SERVICE_NAME,
  OrdersServiceController,
  OrdersServiceControllerMethods,
} from './interfaces/orders.interface';
import { OrdersService } from './orders.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';

@Controller('orders')
@OrdersServiceControllerMethods()
export class OrdersController implements OrdersServiceController {
  constructor(private readonly ordersService: OrdersService) {}

  @GrpcMethod(ORDERS_SERVICE_NAME)
  async createOrder(createDto: CreateOrderDto): Promise<OrderResponse> {
    return this.ordersService.createOrder(createDto);
  }

  @GrpcMethod(ORDERS_SERVICE_NAME)
  async canceledOrder(orderDto: OrderDto): Promise<void> {
    await this.ordersService.canceledOrder(orderDto);
  }

  @GrpcMethod(ORDERS_SERVICE_NAME)
  async shipOrder(orderDto: OrderDto): Promise<void> {
    await this.ordersService.shipOrder(orderDto);
  }

  @GrpcMethod(ORDERS_SERVICE_NAME)
  findOrder(orderDto: OrderDto): Promise<OrderResponse> {
    return this.ordersService.findOrder(orderDto);
  }

  @GrpcMethod(ORDERS_SERVICE_NAME)
  findAllOrders(findAllDto: FindAllOrdersDto): Promise<FindAllOrdersResponse> {
    return this.ordersService.findAllOrders(findAllDto);
  }
}
