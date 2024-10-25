import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UpdateCategoryRequest } from '../interfaces/categories-service.interface';
import { CATEGORY_VALIDATION } from '../categories.constants';

export class UpdateCategoryDto implements Omit<UpdateCategoryRequest, 'id'> {
  @Length(CATEGORY_VALIDATION.name.minLength, CATEGORY_VALIDATION.name.maxLength)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
