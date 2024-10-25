import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateCategoryRequest } from '../interfaces/categories-service.interface';
import { CATEGORY_VALIDATION } from '../categories.constants';

export class CreateCategoryDto implements CreateCategoryRequest {
  @Length(CATEGORY_VALIDATION.name.minLength, CATEGORY_VALIDATION.name.maxLength)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
