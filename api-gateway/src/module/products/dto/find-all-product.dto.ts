import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { FindAllProductsRequest } from '../interfaces/products-service.interface';
import { Transform } from 'class-transformer';
import { transformInt, transformSortParams } from '../../../common/transforms';
import { SortQuery } from 'src/common/pagination';

export class FindAllProductDto implements FindAllProductsRequest {
  @IsNumber()
  @Transform(transformInt)
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @Transform(transformInt)
  @IsOptional()
  pageSize?: number;

  @IsUUID('all', { each: true })
  @IsArray()
  @IsOptional()
  categoriesIds: string[];

  @Transform(transformSortParams)
  @IsArray()
  @IsOptional()
  sortBy: SortQuery[];
}
