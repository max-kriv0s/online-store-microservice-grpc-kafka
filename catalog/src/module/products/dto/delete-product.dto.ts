import { IsNotEmpty, IsUUID } from 'class-validator';
import { DeleteProductRequest } from '../interfaces/products.interface';

export class DeleteProductDto implements DeleteProductRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
