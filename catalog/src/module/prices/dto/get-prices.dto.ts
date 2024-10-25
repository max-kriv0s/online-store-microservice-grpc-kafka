import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { GetProductsPricesRequest } from '../interfaces/prices.interface';
import { Transform } from 'class-transformer';

export class GetProductsPricesDto implements GetProductsPricesRequest {
  @IsUUID('all', { each: true })
  @IsArray()
  @IsOptional()
  productsIds: string[];

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  period?: number;
}
