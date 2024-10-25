import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CATEGORIES_SERVICE_NAME,
  CategoriesResponse,
  CategoriesServiceController,
  CategoriesServiceControllerMethods,
  CategoryResponse,
} from './interfaces/categories.interface';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';

@Controller('categories')
@CategoriesServiceControllerMethods()
export class CategoriesController implements CategoriesServiceController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @GrpcMethod(CATEGORIES_SERVICE_NAME)
  async create(createDto: CreateCategoryDto): Promise<CategoryResponse> {
    return this.categoriesService.createCategory(createDto);
  }

  @GrpcMethod(CATEGORIES_SERVICE_NAME)
  async update(updateDto: UpdateCategoryDto): Promise<CategoryResponse> {
    return this.categoriesService.updateCategory(updateDto);
  }

  @GrpcMethod(CATEGORIES_SERVICE_NAME)
  async delete(deleteDto: DeleteCategoryDto): Promise<void> {
    await this.categoriesService.deleteCategoryDto(deleteDto.id);
  }

  @GrpcMethod(CATEGORIES_SERVICE_NAME)
  async findCategory(findDto: FindCategoryDto): Promise<CategoryResponse> {
    return this.categoriesService.findCategory(findDto);
  }

  @GrpcMethod(CATEGORIES_SERVICE_NAME)
  async findAllCategory(): Promise<CategoriesResponse> {
    return this.categoriesService.findAllCategory();
  }
}
