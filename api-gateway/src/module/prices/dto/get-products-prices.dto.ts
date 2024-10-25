import { transformDateToNumber } from '../../../common/transforms';
import { Transform } from 'class-transformer';
import { IsUUID, IsArray, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { GetProductsPricesRequest } from '../interfaces/prices-service.interface';

export class GetProductsPricesDto implements GetProductsPricesRequest {
  @IsUUID('all', { each: true })
  @IsArray()
  @IsOptional()
  productsIds: string[];

  @IsNumber()
  @Transform(transformDateToNumber)
  @IsNotEmpty()
  @IsOptional()
  period?: number;
}
