import { Injectable } from '@nestjs/common';
import { ProductPriceResponseDto } from './dto/product-price-response.dto';
import { ProductPriceResponse, ProductsPricesResponse } from './interfaces/prices-service.interface';
import fns from 'date-fns';

@Injectable()
export class PricesMapper {
  map(priceResponse: ProductPriceResponse): ProductPriceResponseDto {
    const period = fns.format(new Date(Number(priceResponse.period)), 'yyyy-MM-dd HH:mm:ss');
    const mappedPrice: ProductPriceResponseDto = {
      id: priceResponse.id,
      period,
      productId: priceResponse.productId,
      price: priceResponse.price,
    };
    return mappedPrice;
  }

  mapAll(prices: ProductsPricesResponse): ProductPriceResponseDto[] {
    return prices.productsPrices.map((price) => this.map(price));
  }
}
