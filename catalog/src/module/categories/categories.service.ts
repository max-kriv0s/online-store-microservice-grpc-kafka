import { Injectable } from '@nestjs/common';
import {
  CategoryResponse,
  CreateCategoryRequest,
  FindCategoryRequest,
  UpdateCategoryRequest,
} from './interfaces/categories.interface';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesRepository } from './repositories/categories.repository';
import { ConflictError } from '@/common/exceptions/conflict.error';
import { ERROR_CATEGORY_NAME_NOT_UNIQUE, ERROR_CATEGORY_NOT_FOUND } from './categories.constants';
import { CategoriesMapper } from './categories.mapper';
import { NotFoundError } from '../../common/exceptions/not-found.error';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly mapper: CategoriesMapper,
  ) {}

  async createCategory(createDto: CreateCategoryRequest): Promise<CategoryResponse> {
    const findedCategory = await this.categoriesRepository.findCategoryByName(createDto.name);
    if (findedCategory) {
      throw new ConflictError(ERROR_CATEGORY_NAME_NOT_UNIQUE);
    }

    const newCategory = this.createCategoryEntity(createDto);
    const category = await this.categoriesRepository.save(newCategory);
    return this.mapper.map(category);
  }

  async updateCategory(updateDto: UpdateCategoryRequest) {
    const category = await this.categoriesRepository.findById(updateDto.id);
    if (!category) {
      throw new NotFoundError(ERROR_CATEGORY_NOT_FOUND);
    }

    category.name = updateDto.name ?? category.name;
    category.description = updateDto.description ?? category.description;
    const updatedCategory = await this.categoriesRepository.save(category);
    return this.mapper.map(updatedCategory);
  }

  async deleteCategoryDto(categoryId: string): Promise<void> {
    return this.categoriesRepository.deleteCategory(categoryId);
  }

  async findCategory(findDto: FindCategoryRequest) {
    const category = await this.categoriesRepository.findById(findDto.id);
    if (!category) {
      throw new NotFoundError(ERROR_CATEGORY_NOT_FOUND);
    }
    return this.mapper.map(category);
  }

  async findAllCategory() {
    const categories = await this.categoriesRepository.findCategories();
    return this.mapper.mapAll(categories);
  }

  private createCategoryEntity(createDto: CreateCategoryRequest): CategoryEntity {
    const category = new CategoryEntity();
    category.name = createDto.name;
    category.description = createDto.description;

    return category;
  }
}
