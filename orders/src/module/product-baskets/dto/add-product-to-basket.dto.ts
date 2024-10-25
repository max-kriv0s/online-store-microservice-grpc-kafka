import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { AddProductToBasketRequest } from '../interfaces/product-baskets.interface';

export class AddProductToBasketDto implements AddProductToBasketRequest {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
