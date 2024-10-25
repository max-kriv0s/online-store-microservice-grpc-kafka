import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CATEGORIES_SERVICE_NAME,
  CategoriesResponse,
  CategoriesServiceClient,
  CategoryResponse,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  FindCategoryRequest,
  UpdateCategoryRequest,
} from './interfaces/categories-service.interface';
import { CATEGORIES_CLIENT_NAME } from './categories.constants';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class CategoriesService implements OnModuleInit {
  private categoriesService: CategoriesServiceClient;

  constructor(@Inject(CATEGORIES_CLIENT_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.categoriesService = this.client.getService<CategoriesServiceClient>(CATEGORIES_SERVICE_NAME);
  }

  private getMetadate(): Metadata {
    return new Metadata();
  }

  async createCategory(createDto: CreateCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(
      this.categoriesService
        .create(createDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async updateCategory(updateDto: UpdateCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(
      this.categoriesService
        .update(updateDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async deleteCategory(deleteDto: DeleteCategoryRequest): Promise<void> {
    await firstValueFrom(
      this.categoriesService
        .delete(deleteDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findCategory(findDto: FindCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(
      this.categoriesService
        .findCategory(findDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findAllCategory(): Promise<CategoriesResponse> {
    return firstValueFrom(
      this.categoriesService
        .findAllCategory({}, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
