import { Injectable } from '@nestjs/common';
import { Product, UserBasketResponse } from './interfaces/product-baskets.interface';
import { ProductBasketEntity } from './entities/product-basket.entity';

@Injectable()
export class ProductBasketsMapper {
  map(productsBaskets: ProductBasketEntity): Product {
    const productResponse: Product = {
      basketId: productsBaskets.id,
      productId: productsBaskets.productId,
      quantity: productsBaskets.quantity,
    };
    return productResponse;
  }

  mapAll(productsBaskets: ProductBasketEntity[]): UserBasketResponse {
    return {
      products: productsBaskets.map((productBasket) => this.map(productBasket)),
    };
  }
}
