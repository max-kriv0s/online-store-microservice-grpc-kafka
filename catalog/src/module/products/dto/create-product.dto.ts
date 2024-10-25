import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CreateProductRequest } from '../interfaces/products.interface';
import { PRODUCT_VALIDATION } from '../products.constants';

export class CreateProductDto implements CreateProductRequest {
  @MaxLength(PRODUCT_VALIDATION.name.maxLength)
  @MinLength(PRODUCT_VALIDATION.name.minLength)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
