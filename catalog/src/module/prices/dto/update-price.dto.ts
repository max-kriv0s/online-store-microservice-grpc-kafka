import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { UpdateProductPriceRequest } from '../interfaces/prices.interface';
import { Transform } from 'class-transformer';

export class UpdatePriceDto implements UpdateProductPriceRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  period?: number;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  productId?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;
}
