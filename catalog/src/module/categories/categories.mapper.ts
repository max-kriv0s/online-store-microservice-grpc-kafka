import { Injectable } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesResponse, CategoryResponse } from './interfaces/categories.interface';

@Injectable()
export class CategoriesMapper {
  map(category: CategoryEntity): CategoryResponse {
    const categoryResponse: CategoryResponse = {
      id: category.id,
      name: category.name,
      description: category.description,
    };
    return categoryResponse;
  }

  mapAll(categories: CategoryEntity[]): CategoriesResponse {
    const categoriesResponse = categories.map((category) => this.map(category));
    return {
      categories: categoriesResponse,
    };
  }
}
