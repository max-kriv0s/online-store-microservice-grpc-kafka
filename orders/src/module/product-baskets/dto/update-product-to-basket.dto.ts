import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { UpdateProductToBasketRequest } from '../interfaces/product-baskets.interface';

export class UpdateProductToBasketDto implements UpdateProductToBasketRequest {
  @IsUUID()
  @IsNotEmpty()
  basketId: string;

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
