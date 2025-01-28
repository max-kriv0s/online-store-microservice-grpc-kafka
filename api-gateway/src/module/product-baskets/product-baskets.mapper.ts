import { Injectable } from '@nestjs/common';
import { UserBasketProduct, UserBasketResponseDto } from './dto/user-basket-response.dto';
import { Product, UserBasketResponse } from './interfaces/product-baskets-service.interface';
import { ProductsObject } from '../products/interfaces/products.interface';

@Injectable()
export class ProductBasketsMapper {
  map(item: Product, products: ProductsObject): UserBasketProduct {
    const product = products[item.productId];
    return {
      basketId: item.basketId,
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      price: product.price,
      sum: parseFloat((item.quantity * product.price).toFixed(2)),
    };
  }

  mapAll(userBasket: UserBasketResponse, products: ProductsObject): UserBasketResponseDto {
    return {
      products: userBasket.products.map((item) => this.map(item, products)),
    };
  }
}
