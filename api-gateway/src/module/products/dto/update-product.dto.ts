import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UpdateProductRequest } from '../interfaces/products-service.interface';
import { PRODUCT_VALIDATION } from '../products.constants';

export class UpdateProductDto implements Omit<UpdateProductRequest, 'id'> {
  @Length(PRODUCT_VALIDATION.name.minLength, PRODUCT_VALIDATION.name.maxLength)
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
