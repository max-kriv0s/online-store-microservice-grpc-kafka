import { IsNumber, IsNotEmpty, IsUUID } from 'class-validator';
import { transformDateToNumber } from '../../../common/transforms';
import { Transform } from 'class-transformer';
import { AddProductPriceRequest } from '../interfaces/prices-service.interface';

export class AddProductPriceDto implements AddProductPriceRequest {
  @Transform(transformDateToNumber)
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
