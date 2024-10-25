import { IsOptional, IsNumber, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export class SortQuery {
  @IsString()
  @IsNotEmpty()
  field: string;

  @IsEnum(SortDirection)
  @IsNotEmpty()
  direction: SortDirection;
}

export class PaginationOptions {
  @IsNumber()
  @IsOptional()
  readonly pageNumber?: number;

  @IsNumber()
  @IsOptional()
  readonly pageSize?: number;

  @IsOptional()
  readonly sortBy: SortQuery[];
}

export interface IPaginatedResponse<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export interface IPaginator<T> {
  page: number;
  pageSize: number;
  paginate(totalCount: number, date: T[]): IPaginatedResponse<T>;
}

export class Paginator<T> implements IPaginator<T> {
  constructor(
    public page: number,
    public pageSize: number,
  ) {}

  paginate(totalCount: number, data: T[]): IPaginatedResponse<T> {
    return {
      pagesCount: Math.ceil(totalCount / this.pageSize),
      page: this.page,
      pageSize: this.pageSize,
      totalCount,
      items: data,
    };
  }
}
