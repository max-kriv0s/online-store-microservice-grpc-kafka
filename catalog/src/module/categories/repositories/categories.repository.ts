import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) {}

  async save(category: CategoryEntity): Promise<CategoryEntity> {
    return this.categoryRepository.save(category);
  }

  async findById(categoryId: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOneBy({ id: categoryId });
  }

  async findCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  async deleteCategory(categoryId: string): Promise<void> {
    this.categoryRepository.delete({ id: categoryId });
  }

  async findCategoryByName(categoryName: string): Promise<CategoryEntity | null> {
    return this.categoryRepository.findOne({ where: { name: categoryName } });
  }
}
