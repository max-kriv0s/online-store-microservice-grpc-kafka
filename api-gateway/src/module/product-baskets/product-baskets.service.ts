import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AddProductToBasketRequest,
  DeleteProductInBasketRequest,
  PRODUCT_BASKETS_SERVICE_NAME,
  ProductBasketsServiceClient,
  UpdateProductToBasketRequest,
  UserBasketRequest,
} from './interfaces/product-baskets-service.interface';
import { UserBasketResponseDto } from './dto/user-basket-response.dto';
import { PRODUCT_BASKETS_CLIENT_NAME } from './product-baskets.constants';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ProductBasketsMapper } from './product-baskets.mapper';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductBasketsService implements OnModuleInit {
  private productBasketsService: ProductBasketsServiceClient;

  constructor(
    @Inject(PRODUCT_BASKETS_CLIENT_NAME) private client: ClientGrpc,
    private readonly mapper: ProductBasketsMapper,
    private readonly productsService: ProductsService,
  ) {}

  onModuleInit() {
    this.productBasketsService = this.client.getService<ProductBasketsServiceClient>(PRODUCT_BASKETS_SERVICE_NAME);
  }

  private getMetadate(): Metadata {
    return new Metadata();
  }

  async addProductToBasket(dto: AddProductToBasketRequest): Promise<UserBasketResponseDto> {
    const userBasket = await firstValueFrom(
      this.productBasketsService
        .addProductToBasket(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    const productsIds = userBasket.products.map((item) => item.productId);
    const products = await this.productsService.getProductsByIds(productsIds);
    return this.mapper.mapAll(userBasket, products);
  }

  async updateProductToBasket(dto: UpdateProductToBasketRequest): Promise<UserBasketResponseDto> {
    const userBasket = await firstValueFrom(
      this.productBasketsService
        .updateProductToBasket(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    const productsIds = userBasket.products.map((item) => item.productId);
    const products = await this.productsService.getProductsByIds(productsIds);
    return this.mapper.mapAll(userBasket, products);
  }

  async deleteProductInBasket(dto: DeleteProductInBasketRequest): Promise<UserBasketResponseDto> {
    const userBasket = await firstValueFrom(
      this.productBasketsService
        .deleteProductInBasket(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    if (!userBasket.products.length) {
      return { products: [] };
    }

    const productsIds = userBasket.products.map((item) => item.productId);
    const products = await this.productsService.getProductsByIds(productsIds);
    return this.mapper.mapAll(userBasket, products);
  }

  async clearTheBasket(dto: UserBasketRequest): Promise<UserBasketResponseDto> {
    await firstValueFrom(
      this.productBasketsService
        .clearTheBasket(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    return { products: [] };
  }

  async getProductBasket(dto: UserBasketRequest): Promise<UserBasketResponseDto> {
    const userBasket = await firstValueFrom(
      this.productBasketsService
        .getProductBasket(dto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    if (!userBasket.products?.length) {
      return { products: [] };
    }

    const productsIds = userBasket.products.map((item) => item.productId);
    const products = await this.productsService.getProductsByIds(productsIds);
    return this.mapper.mapAll(userBasket, products);
  }
}
