import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { AddProductPriceRequest } from '../interfaces/prices.interface';
import { Transform } from 'class-transformer';

export class AddPriceDto implements AddProductPriceRequest {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  period: number;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
