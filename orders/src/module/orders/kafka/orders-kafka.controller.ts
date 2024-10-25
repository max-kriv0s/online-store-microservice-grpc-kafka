import { Controller } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { OrdersKafkaConsumer } from './enums/orders-kafka-consumer.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersKafkaController {
  constructor(private readonly ordersService: OrdersService) {}

  @EventPattern(OrdersKafkaConsumer.WarehausesUpdateStatus, Transport.KAFKA)
  async updateOrderStatus(@Payload() dto: UpdateOrderStatusDto) {
    await this.ordersService.updateOrderStatus(dto);
  }
}
