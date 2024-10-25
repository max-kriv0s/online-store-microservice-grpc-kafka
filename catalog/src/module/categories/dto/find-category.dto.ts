import { IsNotEmpty, IsUUID } from 'class-validator';
import { FindCategoryRequest } from '../interfaces/categories.interface';

export class FindCategoryDto implements FindCategoryRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
