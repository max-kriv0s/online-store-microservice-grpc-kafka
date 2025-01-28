import { IsArray, IsUUID } from 'class-validator';
import { GetProductsByIdsRequest } from '../interfaces/products.interface';

export class GetProductByIdsDto implements GetProductsByIdsRequest {
  @IsUUID('all', { each: true })
  @IsArray()
  ids: string[];
}
