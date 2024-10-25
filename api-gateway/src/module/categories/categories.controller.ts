import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesResponse, CategoryResponse } from './interfaces/categories-service.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersRoles } from '../../common/enums/role.enum';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(UsersRoles.Admin, UsersRoles.Moderator)
  @Post()
  async createCategory(@Body() createDto: CreateCategoryDto): Promise<CategoryResponse> {
    return this.categoriesService.createCategory(createDto);
  }

  @Roles(UsersRoles.Admin, UsersRoles.Moderator)
  @Patch(':id')
  async updateCategory(@Body() updateDto: UpdateCategoryDto, @Param('id') id: string): Promise<CategoryResponse> {
    return this.categoriesService.updateCategory({ id, ...updateDto });
  }

  @Roles(UsersRoles.Admin, UsersRoles.Moderator)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoriesService.deleteCategory({ id });
  }

  @Get(':id')
  async findCategory(@Param('id') id: string): Promise<CategoryResponse> {
    return this.categoriesService.findCategory({ id });
  }

  @Get()
  async findAllCategory(): Promise<CategoriesResponse> {
    return this.categoriesService.findAllCategory();
  }
}
