import { IsNotEmpty, IsUUID } from 'class-validator';
import { DeleteCategoryRequest } from '../interfaces/categories.interface';

export class DeleteCategoryDto implements DeleteCategoryRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
