import { SortQuery } from '../../../common/pagination';

export interface SearchProductsParams {
  ids?: string[];
  pageNumber?: number;
  pageSize?: number;
  skip?: number;
  sortBy?: SortQuery[];
  categoriesIds?: string[];
}
