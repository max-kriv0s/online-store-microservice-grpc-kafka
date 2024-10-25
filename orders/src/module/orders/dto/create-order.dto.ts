import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { CreateOrderRequest, Item } from '../interfaces/orders.interface';
import { Type } from 'class-transformer';

export class CreateOrderDto implements CreateOrderRequest {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => ItemDto)
  items: ItemDto[];
}

export class ItemDto implements Item {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;

  @IsNumber()
  @IsNotEmpty()
  sum: number;
}
