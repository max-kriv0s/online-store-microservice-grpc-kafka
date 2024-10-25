import { Injectable } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { ProductResponse, ProductsResponse } from './interfaces/products.interface';
import { ProductPriceResponse } from '../prices/interfaces/prices.interface';

@Injectable()
export class ProductsMapper {
  map(product: ProductEntity, price: number = 0): ProductResponse {
    const productResponse: ProductResponse = {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      price,
    };
    return productResponse;
  }

  mapAll(products: ProductEntity[], productsPrices: ProductPriceResponse[]): ProductResponse[] {
    const prices = productsPrices.reduce((acc, productPrice) => {
      acc[productPrice.productId] = productPrice.price;
      return acc;
    }, {});

    return products.map((product) => {
      const price: number = prices[product.id];
      return this.map(product, price);
    });
  }
}
