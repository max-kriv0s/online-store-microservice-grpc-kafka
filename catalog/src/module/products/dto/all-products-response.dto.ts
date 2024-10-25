import { Paginator } from '../../../common/pagination';
import { ProductEntity } from '../entities/product.entity';
import { ProductResponse } from '../interfaces/products.interface';

export class ProductsPaginatedDto {
  readonly products: ProductEntity[];
  readonly total: number;
}

export class ProductsPagination extends Paginator<ProductResponse> {
  constructor(page: number, pageSize: number) {
    super(page, pageSize);
  }
}
