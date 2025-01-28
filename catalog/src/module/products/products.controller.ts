import { Controller } from '@nestjs/common';
import {
  GetProductsByIdsResponse,
  ProductResponse,
  PRODUCTS_SERVICE_NAME,
  ProductsResponse,
  ProductsServiceController,
  ProductsServiceControllerMethods,
} from './interfaces/products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { DeleteProductDto } from './dto/delete-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { GetProductByIdsDto } from './dto/get-products-by-ids.dto';

@Controller('products')
@ProductsServiceControllerMethods()
export class ProductsController implements ProductsServiceController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod(PRODUCTS_SERVICE_NAME)
  async create(createDto: CreateProductDto): Promise<ProductResponse> {
    return this.productsService.createProduct(createDto);
  }

  @GrpcMethod(PRODUCTS_SERVICE_NAME)
  async update(updateDto: UpdateProductDto): Promise<ProductResponse> {
    return this.productsService.updateProduct(updateDto);
  }

  @GrpcMethod(PRODUCTS_SERVICE_NAME)
  async delete({ id }: DeleteProductDto): Promise<void> {
    await this.productsService.deleteProduct(id);
  }

  @GrpcMethod(PRODUCTS_SERVICE_NAME)
  async findProduct({ id }: FindProductDto): Promise<ProductResponse> {
    return this.productsService.findProductById(id);
  }

  @GrpcMethod(PRODUCTS_SERVICE_NAME)
  async findAllProducts(findAllDto: FindAllProductsDto): Promise<ProductsResponse> {
    return this.productsService.findAllProducts(findAllDto);
  }

  @GrpcMethod(PRODUCTS_SERVICE_NAME)
  getProductsByIds(idsDto: GetProductByIdsDto): Promise<GetProductsByIdsResponse> {
    return this.productsService.getProductsByIds(idsDto);
  }
}
