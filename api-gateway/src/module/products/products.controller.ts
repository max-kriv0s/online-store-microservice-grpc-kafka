import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductsService } from './products.service';
import { ProductResponse, ProductsResponse } from './interfaces/products-service.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersRoles } from '../../common/enums/role.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UsersRoles.Admin, UsersRoles.Moderator)
  @Post()
  async createProduct(@Body() createDto: CreateProductDto): Promise<ProductResponse> {
    return this.productsService.createProduct(createDto);
  }

  @Roles(UsersRoles.Admin, UsersRoles.Moderator)
  @Patch(':id')
  async updateProduct(@Body() updateDto: UpdateProductDto, @Param('id') id: string): Promise<ProductResponse> {
    return this.productsService.updateProduct({ id, ...updateDto });
  }

  @Roles(UsersRoles.Admin, UsersRoles.Moderator)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productsService.deleteProduct({ id });
  }

  @Get(':id')
  async findProduct(@Param('id') id: string): Promise<ProductResponse> {
    return this.productsService.findProduct({ id });
  }

  @Get()
  async findAllProducts(@Query() queryParams: FindAllProductDto): Promise<ProductsResponse> {
    return this.productsService.findAllProducts(queryParams);
  }
}
