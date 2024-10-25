import { IsNotEmpty, IsUUID } from 'class-validator';
import { DeleteProductPriceRequest } from '../interfaces/prices.interface';

export class DeletePriceDto implements DeleteProductPriceRequest {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
