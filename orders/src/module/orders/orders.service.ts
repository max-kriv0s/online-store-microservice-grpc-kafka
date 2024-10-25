import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  CreateOrderRequest,
  FindAllOrdersRequest,
  FindAllOrdersResponse,
  Item,
  OrderRequest,
  OrderResponse,
} from './interfaces/orders.interface';
import { OrderRepository } from './repositories/orders.repository';
import { OrderEntity } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';
import fns from 'date-fns';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrdersMapper } from './orders.mapper';
import { NotFoundError } from '../../common/exceptions/not-found.error';
import {
  ERROR_INVALID_STATUS,
  ERROR_ORDER_NOT_FOUND,
  ORDERS_KAFKA_CLIENT_NAME,
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
} from './orders.constants';
import { ForbiddenError } from '../../common/exceptions/forbidden.error';
import { SearchOrdersParams, StatusTransition } from './interfaces/orders-service.interface';
import { ConflictError, InternalServerError } from '../../common/exceptions';
import { SortDirection, SortQuery } from '../../common/pagination';
import { OrdersPagination } from './dto/find-all-orders.dto';
import { CreateOrderSaga } from './saga/create-order.saga';
import { DataSource } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { lastValueFrom } from 'rxjs';
import { OrderMessageResponse } from './kafka/interfaces/order-message-response.interface';
import { OrderKafkaTopic } from './kafka/enums/orders-kafka-topic.enum';
import { ClientKafka } from '@nestjs/microservices';
import { UpdateOrderStatus } from './kafka/interfaces/update-order-status.interface';

@Injectable()
export class OrdersService {
  protected loggerContext: string = OrdersService.name;

  constructor(
    private readonly ordersRepository: OrderRepository,
    private readonly mapper: OrdersMapper,
    private readonly createOrderSaga: CreateOrderSaga,
    private readonly dataSource: DataSource,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(ORDERS_KAFKA_CLIENT_NAME) private ordersClient: ClientKafka,
  ) {}

  async createOrder(createDto: CreateOrderRequest): Promise<OrderResponse> {
    const entity = this.createOrderEntity(createDto);
    const order = await this.ordersRepository.save(entity);
    await this.createOrderSaga.execute(order);
    return this.mapper.map(order);
  }

  async canceledOrder(orderDto: OrderRequest): Promise<void> {
    const order = await this.ordersRepository.findOrderById(orderDto.orderId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.checkAndUpdateOrderStatus(order, orderDto.customerId, OrderStatus.Canceled);
      await this.ordersRepository.save(order);

      const message = this.mapper.getOrderMessage(order);
      const response = await lastValueFrom(
        this.ordersClient.send<OrderMessageResponse>(OrderKafkaTopic.OrderRestockStock, message),
      );
      if (!response.success) {
        throw new Error(response.error);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error, this.loggerContext);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async shipOrder(orderDto: OrderRequest): Promise<void> {
    const order = await this.ordersRepository.findOrderById(orderDto.orderId);
    await this.checkAndUpdateOrderStatus(order, orderDto.customerId, OrderStatus.Done);
    await this.ordersRepository.save(order);

    const message = this.mapper.getOrderMessage(order);
    await this.ordersClient.emit(OrderKafkaTopic.SalesOrder, message);
  }

  async findOrder(orderDto: OrderRequest): Promise<OrderResponse> {
    const order = await this.ordersRepository.findOrderById(orderDto.orderId);
    if (!order) {
      throw new NotFoundError(ERROR_ORDER_NOT_FOUND);
    }
    if (order.customerId !== orderDto.customerId) {
      throw new ForbiddenError();
    }
    return this.mapper.map(order);
  }

  async findAllOrders(findAllDto: FindAllOrdersRequest): Promise<FindAllOrdersResponse> {
    const searchParam = this.getSearchOrdersParams(findAllDto);
    const [orders, total] = await this.ordersRepository.findAllOrdersAndCount(searchParam);

    const paginator = new OrdersPagination(searchParam.pageNumber, searchParam.pageSize);

    const items = this.mapper.mapAll(orders);
    return paginator.paginate(total, items);
  }

  private createOrderEntity(createDto: CreateOrderRequest): OrderEntity {
    let totalSum = 0;
    const items: OrderItemEntity[] = createDto.items.map((item) => {
      totalSum += item.sum;
      return this.createOrderItemEntity(item);
    });

    const order = new OrderEntity();
    order.status = OrderStatus.Created;
    order.date = fns.startOfToday();
    order.totalSum = totalSum;
    order.customerId = createDto.customerId;
    order.orderItems = items;

    return order;
  }

  private createOrderItemEntity(itemDto: Item): OrderItemEntity {
    const orderItem = new OrderItemEntity();
    orderItem.productId = itemDto.productId;
    orderItem.quantity = itemDto.quantity;
    orderItem.unitPrice = itemDto.unitPrice;
    orderItem.sum = itemDto.sum;

    return orderItem;
  }

  private async checkAndUpdateOrderStatus(order: OrderEntity, customerId: string, status: OrderStatus): Promise<void> {
    if (!order) {
      throw new NotFoundError(ERROR_ORDER_NOT_FOUND);
    }
    if (order.customerId !== customerId) {
      throw new ForbiddenError();
    }

    const statusTransition = this.getStatusTransition();
    if (!statusTransition.hasOwnProperty(order.status)) {
      throw new InternalServerError(ERROR_INVALID_STATUS);
    }
    const availableStatuses = statusTransition[order.status];
    if (!availableStatuses.includes(status)) {
      throw new ConflictError(ERROR_INVALID_STATUS);
    }
    order.status = status;
  }

  private getStatusTransition(): StatusTransition {
    const statusTransition = {
      [OrderStatus.Created]: [OrderStatus.Created, OrderStatus.Confirmed, OrderStatus.Canceled],
      [OrderStatus.Confirmed]: [OrderStatus.Processing, OrderStatus.Canceled],
      [OrderStatus.Processing]: [OrderStatus.Collected, OrderStatus.Canceled],
      [OrderStatus.Collected]: [OrderStatus.Done, OrderStatus.Canceled],
    };

    return statusTransition;
  }

  private getSearchOrdersParams(findAllDto: FindAllOrdersRequest): SearchOrdersParams {
    const pageNumber = findAllDto.pageNumber || PAGE_NUMBER_DEFAULT;
    const pageSize = findAllDto.pageSize || PAGE_SIZE_DEFAULT;
    const skip = (pageNumber - 1) * pageSize;

    const sortBy: SortQuery[] = [];
    if (findAllDto.sortBy?.length) {
      for (const { field, direction } of findAllDto.sortBy) {
        const sortDirections = Object.values(SortDirection);
        let sortDirection = SortDirection.Desc;
        const indexSortDirection = sortDirections.indexOf(direction as SortDirection);
        if (indexSortDirection >= 0) {
          sortDirection = sortDirections[indexSortDirection];
        }
        sortBy.push({ field, direction: sortDirection });
      }
    } else {
      sortBy.push({ field: 'createdAt', direction: SortDirection.Desc });
    }

    return {
      pageNumber,
      pageSize,
      skip,
      sortBy,
      customerId: findAllDto.customerId,
    };
  }

  async updateOrderStatus(dto: UpdateOrderStatus): Promise<void> {
    const order = await this.ordersRepository.findOrderById(dto.orderId);
    await this.checkAndUpdateOrderStatus(order, order.customerId, dto.newStatus);
    await this.ordersRepository.save(order);
  }
}
