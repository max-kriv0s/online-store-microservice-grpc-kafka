import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { UpdateCategoryRequest } from '../interfaces/categories.interface';
import { CATEGORY_VALIDATION } from '../categories.constants';

export class UpdateCategoryDto implements UpdateCategoryRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @MaxLength(CATEGORY_VALIDATION.name.length)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
