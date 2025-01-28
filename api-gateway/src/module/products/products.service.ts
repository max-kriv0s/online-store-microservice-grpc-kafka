import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateProductRequest,
  DeleteProductRequest,
  FindAllProductsRequest,
  FindProductRequest,
  ProductResponse,
  PRODUCTS_SERVICE_NAME,
  ProductsResponse,
  ProductsServiceClient,
  UpdateProductRequest,
} from './interfaces/products-service.interface';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { PRODUCTS_CLIENT_NAME } from './products.constants';
import { Metadata } from '@grpc/grpc-js';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ProductsMapper } from './products.mapper';
import { ProductsObject } from './interfaces/products.interface';

@Injectable()
export class ProductsService implements OnModuleInit {
  private productsService: ProductsServiceClient;

  constructor(
    @Inject(PRODUCTS_CLIENT_NAME) private client: ClientGrpc,
    private readonly mapper: ProductsMapper,
  ) {}

  onModuleInit() {
    this.productsService = this.client.getService<ProductsServiceClient>(PRODUCTS_SERVICE_NAME);
  }

  private getMetadate(): Metadata {
    return new Metadata();
  }

  async createProduct(createDto: CreateProductRequest): Promise<ProductResponse> {
    return firstValueFrom(
      this.productsService
        .create(createDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async updateProduct(updateDto: UpdateProductRequest): Promise<ProductResponse> {
    return firstValueFrom(
      this.productsService
        .update(updateDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async deleteProduct(deleteDto: DeleteProductRequest): Promise<void> {
    await firstValueFrom(
      this.productsService
        .delete(deleteDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findProduct(findDto: FindProductRequest): Promise<ProductResponse> {
    return firstValueFrom(
      this.productsService
        .findProduct(findDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findAllProducts(queryParams: FindAllProductsRequest): Promise<ProductsResponse> {
    return firstValueFrom(
      this.productsService
        .findAllProducts(queryParams, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async getProductsByIds(ids: string[]): Promise<ProductsObject> {
    if (!ids.length) {
      return {};
    }

    const productsResponse = await firstValueFrom(
      this.productsService
        .getProductsByIds({ ids }, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    return this.mapper.productsToProductsObject(productsResponse);
  }
}
