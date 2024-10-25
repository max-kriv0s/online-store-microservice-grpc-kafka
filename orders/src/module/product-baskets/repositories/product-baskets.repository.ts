import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductBasketEntity } from '../entities/product-basket.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductBasketsRepository {
  constructor(
    @InjectRepository(ProductBasketEntity) private readonly basketRepository: Repository<ProductBasketEntity>,
  ) {}

  async save(productBasket: ProductBasketEntity): Promise<ProductBasketEntity> {
    return this.basketRepository.save(productBasket);
  }

  async findProductBasketById(productBasketId: string): Promise<ProductBasketEntity | null> {
    return this.basketRepository.findOneBy({ id: productBasketId });
  }

  async findProductBasketsByUserId(userId: string): Promise<ProductBasketEntity[]> {
    return this.basketRepository.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async findProductBasketByUserIdAndProductId(userId: string, productId: string): Promise<ProductBasketEntity | null> {
    return this.basketRepository.findOneBy({ userId, productId });
  }

  async deleteProductBaskets(productBaskets: ProductBasketEntity[]): Promise<void> {
    this.basketRepository.remove(productBaskets);
  }
}
