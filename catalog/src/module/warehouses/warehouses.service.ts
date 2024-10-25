import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { OrderMessageResponseDto } from './dto/order-message-response.dto';
import { OrderMessageResponse } from './interfaces/order-message-response.interface';
import { OrderMessageCreate } from './interfaces/order-message-create.interface';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ClientKafka } from '@nestjs/microservices';
import { WAREHOUSES_KAFKA_CLIENT_NAME } from './warehouses.constants';
import { WarehausesKafkaTopics } from './enums/warehouses-kafka-topics.enum';
import { WarehousesOrderStatus } from './enums/warehouses-order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WarehousesService {
  protected loggerContex = WarehousesService.name;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(WAREHOUSES_KAFKA_CLIENT_NAME) private warehousesClient: ClientKafka,
  ) {}

  async checkProductsAvailibity(message: OrderMessageCreate): Promise<OrderMessageResponse> {
    this.logger.log(`checkProductsAvailibity: ${JSON.stringify(message)}`, this.loggerContex);
    const messageResponse = new OrderMessageResponseDto(message.orderId);
    return messageResponse;
  }

  async reduceProductsByOrder(message: OrderMessageCreate): Promise<OrderMessageResponse> {
    this.logger.log(`reduceProductsByOrder: ${JSON.stringify(message)}`, this.loggerContex);

    setTimeout(() => {
      this.takeOrderToWork(message);
    }, 1000);

    const messageResponse = new OrderMessageResponseDto(message.orderId);
    return messageResponse;
  }

  async restoreProductsByOrder(message: OrderMessageCreate): Promise<OrderMessageResponse> {
    this.logger.log(`restoreProductsByOrder: ${JSON.stringify(message)}`, this.loggerContex);
    const messageResponse = new OrderMessageResponseDto(message.orderId);
    return messageResponse;
  }

  async recordSaleOfGoods(message: OrderMessageCreate): Promise<void> {
    this.logger.log(`recordSaleOfGoods: ${JSON.stringify(message)}`, this.loggerContex);
  }

  async takeOrderToWork(message: OrderMessageCreate): Promise<void> {
    this.logger.log(`takeOrderToWork: ${JSON.stringify(message)}`, this.loggerContex);

    const messageUpdateStatus = this.getMessageUpdateStatus(message.orderId, WarehousesOrderStatus.Processing);
    await lastValueFrom(this.warehousesClient.emit(WarehausesKafkaTopics.WarehausesUpdateStatus, messageUpdateStatus));

    setTimeout(() => {
      this.gatherProducts(message);
    }, 1000);
  }

  async gatherProducts(message: OrderMessageCreate): Promise<void> {
    this.logger.log(`gatherProducts: ${JSON.stringify(message)}`, this.loggerContex);

    const messageUpdateStatus = this.getMessageUpdateStatus(message.orderId, WarehousesOrderStatus.Collected);
    await this.warehousesClient.emit(WarehausesKafkaTopics.WarehausesUpdateStatus, messageUpdateStatus);
  }

  getMessageUpdateStatus(orderId: string, newStatus: WarehousesOrderStatus): UpdateOrderStatusDto {
    return {
      orderId,
      newStatus,
    };
  }
}
