import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersRoles } from '../../common/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ProductBasketsService } from './product-baskets.service';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { AddProductToBasketDto } from './dto/add-product-to-basket.dto';
import { UpdateProductToBasket } from './dto/update-product-to-basket.dto';
import { UserBasketResponseDto } from './dto/user-basket-response.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UsersRoles.Buyer)
@Controller('product-baskets')
export class ProductBasketsController {
  constructor(private readonly productBasketsService: ProductBasketsService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async addProductToBasket(
    @CurrentUserId() userId: string,
    @Body() addDto: AddProductToBasketDto,
  ): Promise<UserBasketResponseDto> {
    return this.productBasketsService.addProductToBasket({ userId, ...addDto });
  }

  @Patch(':id')
  async updateProductToBasket(
    @CurrentUserId() userId: string,
    @Body() updateDto: UpdateProductToBasket,
    @Param('id') basketId: string,
  ): Promise<UserBasketResponseDto> {
    return this.productBasketsService.updateProductToBasket({ userId, basketId, ...updateDto });
  }

  @Delete(':basketId')
  async deleteProductInBasket(
    @CurrentUserId() userId: string,
    @Param('basketId') basketId: string,
  ): Promise<UserBasketResponseDto> {
    return this.productBasketsService.deleteProductInBasket({ userId, basketId });
  }

  @Delete()
  async clearTheBasket(@CurrentUserId() userId: string): Promise<UserBasketResponseDto> {
    return this.productBasketsService.clearTheBasket({ userId });
  }

  @Get()
  async getProductBasket(@CurrentUserId() userId: string): Promise<UserBasketResponseDto> {
    return this.productBasketsService.getProductBasket({ userId });
  }
}
