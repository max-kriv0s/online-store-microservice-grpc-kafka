import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { FindAllOrdersRequest, SortQuery } from '../../orders/interfaces/orders-service.interface';
import { Transform } from 'class-transformer';
import { transformInt, transformSortParams } from '../../../common/transforms';

export class FindAllOrdersDto implements Omit<FindAllOrdersRequest, 'customerId'> {
  @IsNumber()
  @Transform(transformInt)
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @Transform(transformInt)
  @IsOptional()
  pageSize?: number;

  @Transform(transformSortParams)
  @IsArray()
  @IsOptional()
  sortBy: SortQuery[];
}
