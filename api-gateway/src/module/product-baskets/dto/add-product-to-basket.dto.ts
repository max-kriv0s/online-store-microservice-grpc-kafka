import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { AddProductToBasketRequest } from '../interfaces/product-baskets-service.interface';

export class AddProductToBasketDto implements Omit<AddProductToBasketRequest, 'userId'> {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
