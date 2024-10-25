import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { FindAllOrderResponse, FindAllOrdersRequest, SortQuery } from '../interfaces/orders.interface';
import { Transform } from 'class-transformer';
import { transformSortParams } from '../../../common/transformers';
import { Paginator } from '../../../common/pagination';

export class FindAllOrdersDto implements FindAllOrdersRequest {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @Transform(transformSortParams)
  @IsOptional()
  sortBy: SortQuery[];
}

export class OrdersPagination extends Paginator<FindAllOrderResponse> {
  constructor(page: number, pageSize: number) {
    super(page, pageSize);
  }
}
