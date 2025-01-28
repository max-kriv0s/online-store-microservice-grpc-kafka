import {
  CreateProductRequest,
  DeleteProductRequest,
  FindAllProductsRequest,
  FindProductRequest,
  GetProductsByIdsRequest,
  GetProductsByIdsResponse,
  ProductResponse,
  ProductsResponse,
  ProductsServiceClient,
  UpdateProductRequest,
} from '@/module/products/interfaces/products.interface';
import { Metadata } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { getRandomString } from '../test-utils';

export class ProductsHelper {
  metadata = new Metadata();
  constructor(private readonly productsService: ProductsServiceClient) {}

  getCreateProductDto(categoryId: string, name?: string, description?: string): CreateProductRequest {
    return {
      categoryId,
      name: name ?? getRandomString(10),
      description: description ?? getRandomString(30),
    };
  }

  async createProduct(dto: CreateProductRequest): Promise<ProductResponse> {
    return firstValueFrom(
      this.productsService
        .create(dto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async updateProduct(dto: UpdateProductRequest): Promise<ProductResponse> {
    return firstValueFrom(
      this.productsService
        .update(dto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async deleteProduct(dto: DeleteProductRequest): Promise<void> {
    firstValueFrom(
      this.productsService
        .delete(dto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findProduct(dto: FindProductRequest): Promise<ProductResponse> {
    return firstValueFrom(
      this.productsService
        .findProduct(dto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findAllProducts(dto: FindAllProductsRequest): Promise<ProductsResponse> {
    return firstValueFrom(
      this.productsService
        .findAllProducts(dto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async getProductsByIds(dto: GetProductsByIdsRequest): Promise<GetProductsByIdsResponse> {
    return firstValueFrom(
      this.productsService
        .getProductsByIds(dto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
