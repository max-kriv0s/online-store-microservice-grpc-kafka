import { Transform, Type } from 'class-transformer';
import { SortQuery } from '../../../common/pagination';
import { FindAllProductsRequest } from '../interfaces/products.interface';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { transformSortParams } from '../../../common/transformers';

export class FindAllProductsDto implements FindAllProductsRequest {
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  // @ValidateNested({ each: true })
  // @Type(() => SortQuery)
  @Transform(transformSortParams)
  @IsOptional()
  sortBy: SortQuery[];

  @IsUUID('all', { each: true })
  @IsArray()
  @IsOptional()
  categoriesIds: string[];
}
