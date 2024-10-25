import { IsNotEmpty, IsUUID } from 'class-validator';
import { DeleteProductInBasketRequest } from '../interfaces/product-baskets.interface';

export class DeleteProductInBasketDto implements DeleteProductInBasketRequest {
  @IsUUID()
  @IsNotEmpty()
  basketId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
