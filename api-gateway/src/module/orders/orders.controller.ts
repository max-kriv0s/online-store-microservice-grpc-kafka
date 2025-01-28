import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersRoles } from '../../common/enums/role.enum';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { FindAllOrdersDto } from '../product-baskets/dto/find-all-order.dto';
import { OrdersPaginateResponseDto } from './dto/orders-paginate-response.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UsersRoles.Buyer)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@CurrentUserId() customerId: string, @Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.createOrder({ customerId, ...dto });
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/cancel')
  async canceledOrder(@CurrentUserId() customerId: string, @Param('id') orderId: string): Promise<void> {
    await this.ordersService.canceledOrder({ orderId, customerId });
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/ship')
  async shipOrder(@CurrentUserId() customerId: string, @Param('id') orderId: string): Promise<void> {
    await this.ordersService.shipOrder({ orderId, customerId });
  }

  @Get(':id')
  async findOrder(@CurrentUserId() customerId: string, @Param('id') orderId: string): Promise<OrderResponseDto> {
    return this.ordersService.findOrder({ orderId, customerId });
  }

  @Get()
  async findAllOrders(
    @CurrentUserId() customerId: string,
    @Query() params: FindAllOrdersDto,
  ): Promise<OrdersPaginateResponseDto> {
    return this.ordersService.findAllOrders({ customerId, ...params });
  }
}
