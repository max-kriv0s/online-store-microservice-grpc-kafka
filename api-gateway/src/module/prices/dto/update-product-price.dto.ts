import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { transformDateToNumber } from '../../../common/transforms';
import { UpdateProductPriceRequest } from '../interfaces/prices-service.interface';

export class UpdateProductPriceDto implements Omit<UpdateProductPriceRequest, 'id'> {
  @Transform(transformDateToNumber)
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
