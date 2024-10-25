import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserBasketRequest } from '../interfaces/product-baskets.interface';

export class UserBasketDto implements UserBasketRequest {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
