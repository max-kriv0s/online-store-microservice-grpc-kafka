import { IsUUID, IsNotEmpty, IsNumber, ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateOrderRequest, Item } from '../interfaces/orders-service.interface';
import { Type } from 'class-transformer';

export class CreateOrderDto implements Omit<CreateOrderRequest, 'customerId'> {
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
