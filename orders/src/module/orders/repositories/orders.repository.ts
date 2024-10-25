import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SearchOrdersParams } from '../interfaces/orders-service.interface';

@Injectable()
export class OrderRepository {
  constructor(@InjectRepository(OrderEntity) private readonly ordersRepository: Repository<OrderEntity>) {}

  async save(order: OrderEntity): Promise<OrderEntity> {
    return this.ordersRepository.save(order);
  }

  async findOrderById(id: string): Promise<OrderEntity | null> {
    return this.ordersRepository.findOne({ where: { id }, relations: { orderItems: true } });
  }

  async findAllOrdersAndCount(searchParam: SearchOrdersParams): Promise<[OrderEntity[], number]> {
    return this.getQueryBuilder(searchParam).getManyAndCount();
  }

  getQueryBuilder(params: SearchOrdersParams, alias = 'orders', joins = true): SelectQueryBuilder<OrderEntity> {
    const query = this.ordersRepository.createQueryBuilder(alias);
    query.andWhere(`${alias}.customerId = :customerId`, { customerId: params.customerId });

    if (joins) {
      query.leftJoinAndSelect(`${alias}.orderItems`, 'orderItems');
    }

    if (params.ids?.length) {
      query.andWhere(`${alias}.id IN (:...ids)`, { ids: params.ids });
    }

    // Sort
    if (params.sortBy?.length) {
      for (const { field, direction } of params.sortBy) {
        query.addOrderBy(`${alias}.${field}`, direction);
      }
    }

    // Paginate
    if (params.pageSize) {
      query.take(params.pageSize);
    }
    if (params.skip) {
      query.skip(params.skip);
    }

    return query;
  }

  async updateOrderStatus(order: OrderEntity): Promise<void> {
    await this.ordersRepository.update(order.id, { status: order.status });
  }
}
