import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { EventPattern, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { WarehausesKafkaConsumers } from './enums/warehouses-kafka-consumers.enum';
import { OrderMessageCreateDto } from './dto/order-message-create.dto';

@Controller('warehouses')
@UseInterceptors(ClassSerializerInterceptor)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @MessagePattern(WarehausesKafkaConsumers.OrderCreate, Transport.KAFKA)
  async checkProductsAvailibity(@Payload() message: OrderMessageCreateDto) {
    return this.warehousesService.checkProductsAvailibity(message);
  }

  @MessagePattern(WarehausesKafkaConsumers.OrderReduceStock, Transport.KAFKA)
  async reduceProductsByOrder(@Payload() message: OrderMessageCreateDto) {
    return this.warehousesService.reduceProductsByOrder(message);
  }

  @MessagePattern(WarehausesKafkaConsumers.OrderRestockStock, Transport.KAFKA)
  async restoreProductsByOrder(@Payload() message: OrderMessageCreateDto) {
    return this.warehousesService.restoreProductsByOrder(message);
  }

  @EventPattern(WarehausesKafkaConsumers.SalesOrder, Transport.KAFKA)
  async recordSaleOfGoods(@Payload() message: OrderMessageCreateDto): Promise<void> {
    await this.warehousesService.recordSaleOfGoods(message);
  }
}
