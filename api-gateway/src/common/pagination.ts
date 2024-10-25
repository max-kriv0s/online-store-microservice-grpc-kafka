import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export type SortDirectionUnionType = `${SortDirection}`;

export class SortQuery {
  @IsString()
  @IsNotEmpty()
  field: string;

  @IsEnum(SortDirection)
  @IsNotEmpty()
  direction: SortDirection;
}
