import { TransformFnParams } from 'class-transformer';
import { SortDirection as GrpcDirection } from '../module/orders/interfaces/orders.interface';
import { SortDirection, SortQuery } from './pagination';

export const transformSortParams = ({ value }: TransformFnParams): SortQuery => {
  const sortDirections = Object.values(SortDirection);

  return value.map((condition: SortQuery) => {
    const { field, direction } = condition;

    const grpsDirection = Object.values(GrpcDirection)[direction].toUpperCase() as SortDirection;
    let sortDirection = SortDirection.Desc;
    if (sortDirections.includes(grpsDirection)) {
      const indexDirection = sortDirections.indexOf(grpsDirection);
      sortDirection = sortDirections[indexDirection];
    }

    return {
      field,
      direction: sortDirection,
    };
  });
};
