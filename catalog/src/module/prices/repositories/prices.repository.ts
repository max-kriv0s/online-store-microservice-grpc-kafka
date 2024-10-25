import { Injectable } from '@nestjs/common';
import { PriceEntity } from '../entities/price.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchPricesParams } from '../interfaces/prices-service.interface';

@Injectable()
export class PricesRepository {
  constructor(@InjectRepository(PriceEntity) private readonly priceRepository: Repository<PriceEntity>) {}

  async save(price: PriceEntity) {
    return this.priceRepository.save(price);
  }

  async findPryceByPeriodAndProductId(productId: string, period: Date): Promise<PriceEntity | null> {
    return this.priceRepository.findOneBy({ productId, period });
  }

  async findById(priceId: string): Promise<PriceEntity | null> {
    return this.priceRepository.findOneBy({ id: priceId });
  }

  async delete(priceId: string): Promise<void> {
    this.priceRepository.delete({ id: priceId });
  }

  async getPricesByProductsIds(params: SearchPricesParams): Promise<PriceEntity[]> {
    return this.getQueryBuilder(params).addOrderBy(`period`).getMany();
  }

  async getCurrentPricesProducts(params: SearchPricesParams): Promise<PriceEntity[]> {
    const alias = 'prices';
    const query = this.getQueryBuilder(params, alias);

    const lastPricesAlias = 'last_prices';
    const lastPriceChangeDateQuery = this.priceRepository
      .createQueryBuilder(lastPricesAlias)
      .select(`${lastPricesAlias}.product_id, MAX(${lastPricesAlias}.period) as period`)
      .groupBy(`${lastPricesAlias}.product_id`);

    if (params.productsIds?.length) {
      lastPriceChangeDateQuery.andWhere(`${lastPricesAlias}.productId IN (:...productsIds)`, {
        productsIds: params.productsIds,
      });
    }

    if (params.period) {
      lastPriceChangeDateQuery.andWhere(`${lastPricesAlias}.period <= :period`, { period: params.period });
    }

    query.addCommonTableExpression(lastPriceChangeDateQuery, lastPricesAlias);
    query.innerJoin(lastPricesAlias, lastPricesAlias, `${alias}.period = ${lastPricesAlias}.period`);
    query.setParameters({ productsIds: params.productsIds, period: params.period });

    return query.getMany();
  }

  private getQueryBuilder(params: SearchPricesParams, alias = 'prices'): SelectQueryBuilder<PriceEntity> {
    const query = this.priceRepository.createQueryBuilder(alias);
    if (params.productsIds?.length) {
      query.andWhere(`${alias}.productId IN (:...productsIds)`, { productsIds: params.productsIds });
    }

    if (params.period) {
      query.andWhere(`${alias}.period <= :period`, { period: params.period });
    }

    return query;
  }
}
