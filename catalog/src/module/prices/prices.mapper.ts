import { Injectable } from '@nestjs/common';
import { PriceEntity } from './entities/price.entity';
import { ProductPriceResponse } from './interfaces/prices.interface';

@Injectable()
export class PricesMapper {
  map(priceEntity: PriceEntity): ProductPriceResponse {
    const mappedPrice: ProductPriceResponse = {
      id: priceEntity.id,
      period: priceEntity.period.getTime(),
      productId: priceEntity.productId,
      price: priceEntity.price,
    };
    return mappedPrice;
  }

  mapAll(prices: PriceEntity[]): ProductPriceResponse[] {
    return prices.map((price) => this.map(price));
  }
}
