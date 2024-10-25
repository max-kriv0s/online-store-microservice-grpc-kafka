import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { CreateProductRequest } from '../interfaces/products-service.interface';
import { PRODUCT_VALIDATION } from '../products.constants';

export class CreateProductDto implements CreateProductRequest {
  @Length(PRODUCT_VALIDATION.name.minLength, PRODUCT_VALIDATION.name.maxLength)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
