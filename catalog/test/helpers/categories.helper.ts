import {
  CategoriesServiceClient,
  CategoryResponse,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  FindCategoryRequest,
  UpdateCategoryRequest,
} from '@/module/categories/interfaces/categories.interface';
import { Metadata } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { getRandomString } from '../test-utils';

export class CategoriesHelper {
  metadata = new Metadata();
  constructor(private readonly categoriesService: CategoriesServiceClient) {}

  getCreateCategoryDto(name?: string, description?: string): CreateCategoryRequest {
    return { name: name ?? getRandomString(10), description: description ?? getRandomString(30) };
  }

  async createCategory(createDto: CreateCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(
      this.categoriesService
        .create(createDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async updateCategory(updateDto: UpdateCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(
      this.categoriesService
        .update(updateDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async deleteCategory(deleteDto: DeleteCategoryRequest): Promise<void> {
    await firstValueFrom(
      this.categoriesService
        .delete(deleteDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async findCategory(findDto: FindCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(
      this.categoriesService
        .findCategory(findDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
