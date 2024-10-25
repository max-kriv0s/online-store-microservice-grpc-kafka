import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateCategoryRequest } from '../interfaces/categories.interface';
import { CATEGORY_VALIDATION } from '../categories.constants';

export class CreateCategoryDto implements CreateCategoryRequest {
  @MaxLength(CATEGORY_VALIDATION.name.length)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
