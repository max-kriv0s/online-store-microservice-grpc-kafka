import { IsNotEmpty, IsUUID } from 'class-validator';
import { FindProductRequest } from '../interfaces/products.interface';

export class FindProductDto implements FindProductRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
