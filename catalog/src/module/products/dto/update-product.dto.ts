import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { PRODUCT_VALIDATION } from '../products.constants';
import { UpdateProductRequest } from '../interfaces/products.interface';

export class UpdateProductDto implements UpdateProductRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @MaxLength(PRODUCT_VALIDATION.name.maxLength)
  @MinLength(PRODUCT_VALIDATION.name.minLength)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  categoryId?: string;
}
