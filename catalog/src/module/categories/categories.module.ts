import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoriesMapper } from './categories.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoriesService, CategoriesRepository, CategoriesMapper],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
