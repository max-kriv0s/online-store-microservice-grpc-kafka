import { IsUUID, IsNotEmpty, Min, IsNumber } from 'class-validator';
import { UpdateProductToBasketRequest } from '../interfaces/product-baskets-service.interface';

export class UpdateProductToBasket implements Pick<UpdateProductToBasketRequest, 'quantity' | 'productId'> {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
