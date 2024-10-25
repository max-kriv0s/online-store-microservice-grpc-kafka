import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PricesService } from './prices.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersRoles } from '../../common/enums/role.enum';
import { AddProductPriceDto } from './dto/add-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';
import { GetProductsPricesDto } from './dto/get-products-prices.dto';
import { ProductPriceResponseDto } from './dto/product-price-response.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UsersRoles.Admin, UsersRoles.Moderator)
@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  async addProductPrice(@Body() addPriceDto: AddProductPriceDto): Promise<ProductPriceResponseDto> {
    return this.pricesService.addProductPrice(addPriceDto);
  }

  @Patch(':id')
  async updateProductPrice(
    @Body() updatePriceDto: UpdateProductPriceDto,
    @Param('id') id: string,
  ): Promise<ProductPriceResponseDto> {
    return this.pricesService.updateProductPrice({ id, ...updatePriceDto });
  }

  @Delete(':id')
  async deleteProductPrice(@Param('id') id: string): Promise<void> {
    await this.pricesService.deleteProductPrice({ id });
  }

  @Get('/current')
  async getCurrentPricesProducts(
    @Query() getCurrentPriceDto: GetProductsPricesDto,
  ): Promise<ProductPriceResponseDto[]> {
    return this.pricesService.getCurrentPricesProducts(getCurrentPriceDto);
  }

  @Get()
  async getProductsPrices(@Query() getPricesDto: GetProductsPricesDto): Promise<ProductPriceResponseDto[]> {
    return this.pricesService.getProductsPrices(getPricesDto);
  }
}
