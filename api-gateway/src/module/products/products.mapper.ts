import { Injectable } from '@nestjs/common';
import { ProductsObject } from './interfaces/products.interface';
import { GetProductsByIdsResponse } from './interfaces/products-service.interface';

@Injectable()
export class ProductsMapper {
  productsToProductsObject(productsResponse: GetProductsByIdsResponse): ProductsObject {
    const products: ProductsObject = productsResponse.products.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    return products;
  }
}
