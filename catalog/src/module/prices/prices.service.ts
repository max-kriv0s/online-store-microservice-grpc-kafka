import { Injectable } from '@nestjs/common';
import { PricesRepository } from './repositories/prices.repository';
import {
  AddProductPriceRequest,
  GetProductsPricesRequest,
  ProductPriceResponse,
  ProductsPricesResponse,
  UpdateProductPriceRequest,
} from './interfaces/prices.interface';
import { PriceEntity } from './entities/price.entity';
import fns from 'date-fns';
import { PricesMapper } from './prices.mapper';
import { CreatePriceDto } from './dto/create-price.dto';
import { ConflictError } from 'src/common/exceptions/conflict.error';
import { ERROR_PRICE_ALREADY_ASSIGNED, ERROR_PRICE_NOT_FOUND } from './prices.constants';
import { NotFoundError } from '../../common/exceptions/not-found.error';

@Injectable()
export class PricesService {
  constructor(
    private readonly pricesRepository: PricesRepository,
    private readonly mapper: PricesMapper,
  ) {}

  async addProductPrice(addPriceDto: AddProductPriceRequest): Promise<ProductPriceResponse> {
    const period = this.convertNumberPeriodToStartOfDay(addPriceDto.period);
    const findedPrice = await this.pricesRepository.findPryceByPeriodAndProductId(addPriceDto.productId, period);
    if (findedPrice) {
      throw new ConflictError(ERROR_PRICE_ALREADY_ASSIGNED);
    }

    const createDto: CreatePriceDto = {
      period,
      productId: addPriceDto.productId,
      price: addPriceDto.price,
    };
    const newPrice = this.createPriceEntity(createDto);
    const price = await this.pricesRepository.save(newPrice);
    return this.mapper.map(price);
  }

  async updateProductPrice(updatePriceDto: UpdateProductPriceRequest): Promise<ProductPriceResponse> {
    const priceEntity = await this.pricesRepository.findById(updatePriceDto.id);
    if (!priceEntity) {
      throw new NotFoundError(ERROR_PRICE_NOT_FOUND);
    }

    if (updatePriceDto.period) {
      priceEntity.period = this.convertNumberPeriodToStartOfDay(updatePriceDto.period);
    }
    priceEntity.productId = updatePriceDto.productId ?? priceEntity.productId;
    priceEntity.price = updatePriceDto.price ?? priceEntity.price;

    const updatedPrice = await this.pricesRepository.save(priceEntity);
    return this.mapper.map(updatedPrice);
  }

  async deleteProductPrice(priceId: string): Promise<void> {
    this.pricesRepository.delete(priceId);
  }

  async getProductsPrices(pricesDto: GetProductsPricesRequest): Promise<ProductsPricesResponse> {
    const period = this.convertNumberPeriodToStartOfDay(pricesDto.period);
    const prices = await this.pricesRepository.getPricesByProductsIds({ period, productsIds: pricesDto.productsIds });
    return { productsPrices: this.mapper.mapAll(prices) };
  }

  async getCurrentPricesProducts(pricesDto: GetProductsPricesRequest): Promise<ProductsPricesResponse> {
    let period = this.convertNumberPeriodToStartOfDay(pricesDto.period);
    if (!period) {
      period = fns.startOfToday();
    }

    const prices = await this.pricesRepository.getCurrentPricesProducts({ period, productsIds: pricesDto.productsIds });
    return { productsPrices: this.mapper.mapAll(prices) };
  }

  private createPriceEntity(createDto: CreatePriceDto): PriceEntity {
    const price = new PriceEntity();
    price.period = createDto.period;
    price.price = createDto.price;
    price.productId = createDto.productId;

    return price;
  }

  private convertNumberPeriodToStartOfDay(period?: number): Date | undefined {
    if (period) {
      return fns.startOfDay(new Date(period));
    }
  }
}
