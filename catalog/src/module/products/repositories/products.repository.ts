import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SearchProductsParams } from '../interfaces/products-service.interface';
import { SortDirection } from '../../../common/pagination';

@Injectable()
export class ProductsRepository {
  constructor(@InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>) {}

  async save(product: ProductEntity): Promise<ProductEntity> {
    return this.productRepository.save(product);
  }

  async delete(productId: string): Promise<void> {
    this.productRepository.delete({ id: productId });
  }

  async findProductById(productId: string): Promise<ProductEntity | null> {
    return this.getQueryBuilder({ ids: [productId] }).getOne();
  }

  async findAllProductsAndCount(searchParam: SearchProductsParams): Promise<[ProductEntity[], number]> {
    return this.getQueryBuilder(searchParam).getManyAndCount();
  }

  getQueryBuilder(params: SearchProductsParams, alias = 'products'): SelectQueryBuilder<ProductEntity> {
    const query = this.productRepository.createQueryBuilder(alias);

    if (params.ids?.length) {
      query.andWhere(`${alias}.id IN (:...ids)`, { ids: params.ids });
    }

    if (params.categoriesIds?.length) {
      query.andWhere(`${alias}.categoryId IN (:...categoriesIds)`, { categoriesIds: params.categoriesIds });
    }

    // Sort
    if (params.sortBy?.length) {
      for (const { field, direction } of params.sortBy) {
        const sortDirection = direction === SortDirection.asc ? 'ASC' : 'DESC';
        query.addOrderBy(`${alias}.${field}`, sortDirection);
      }
    }

    // Paginate
    if (params.pageSize) {
      query.take(params.pageSize);
    }
    if (params.skip) {
      query.skip(params.skip);
    }

    return query;
  }
}
