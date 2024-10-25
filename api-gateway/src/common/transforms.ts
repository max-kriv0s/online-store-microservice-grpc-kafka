import { TransformFnParams } from 'class-transformer';
import { SortDirectionUnionType, SortQuery } from './pagination';

export const transformInt = ({ value }: TransformFnParams) => {
  return parseInt(value);
};

export const transformDateToNumber = ({ value }: TransformFnParams) => {
  return Date.parse(value);
};

export const transformSortParams = ({ value }: TransformFnParams): SortQuery => {
  return value.split(',').map((condition: string) => {
    const [field, direction] = condition.split('.');
    return {
      field: field,
      direction: direction as SortDirectionUnionType,
    };
  });
};
