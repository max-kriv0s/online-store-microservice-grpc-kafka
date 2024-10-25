import { Controller } from '@nestjs/common';
import {
  PRODUCT_BASKETS_SERVICE_NAME,
  ProductBasketsServiceController,
  ProductBasketsServiceControllerMethods,
  UserBasketResponse,
} from './interfaces/product-baskets.interface';
import { ProductBasketsService } from './product-baskets.service';
import { GrpcMethod } from '@nestjs/microservices';
import { AddProductToBasketDto } from './dto/add-product-to-basket.dto';
import { UpdateProductToBasketDto } from './dto/update-product-to-basket.dto';
import { DeleteProductInBasketDto } from './dto/delete-product-in-basket.dto';
import { UserBasketDto } from './dto/user-basket.dto';

@Controller('product-baskets')
@ProductBasketsServiceControllerMethods()
export class ProductBasketsController implements ProductBasketsServiceController {
  constructor(private readonly productBasketsService: ProductBasketsService) {}

  @GrpcMethod(PRODUCT_BASKETS_SERVICE_NAME)
  async addProductToBasket(addProductDto: AddProductToBasketDto): Promise<UserBasketResponse> {
    return this.productBasketsService.addProductToBasket(addProductDto);
  }

  @GrpcMethod(PRODUCT_BASKETS_SERVICE_NAME)
  async updateProductToBasket(updateDto: UpdateProductToBasketDto): Promise<UserBasketResponse> {
    return this.productBasketsService.updateProductToBasket(updateDto);
  }

  @GrpcMethod(PRODUCT_BASKETS_SERVICE_NAME)
  async deleteProductInBasket(deleteDto: DeleteProductInBasketDto): Promise<UserBasketResponse> {
    return this.productBasketsService.deleteProductInBasket(deleteDto);
  }

  @GrpcMethod(PRODUCT_BASKETS_SERVICE_NAME)
  async clearTheBasket(userBasketDto: UserBasketDto): Promise<UserBasketResponse> {
    return this.productBasketsService.clearTheBasket(userBasketDto);
  }

  @GrpcMethod(PRODUCT_BASKETS_SERVICE_NAME)
  async getProductBasket(userBasketDto: UserBasketDto): Promise<UserBasketResponse> {
    return this.productBasketsService.getProductBasket(userBasketDto);
  }
}
