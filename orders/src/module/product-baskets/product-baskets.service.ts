import { Injectable } from '@nestjs/common';
import {
  AddProductToBasketRequest,
  DeleteProductInBasketRequest,
  UpdateProductToBasketRequest,
  UserBasketRequest,
  UserBasketResponse,
} from './interfaces/product-baskets.interface';
import { ProductBasketEntity } from './entities/product-basket.entity';
import { ProductBasketsRepository } from './repositories/product-baskets.repository';
import { ConflictError } from 'src/common/exceptions/conflict.error';
import {
  ERROR_ITEM_IS_ALREADY_BASKET,
  ERROR_PRODUCT_BASKET_FORBIDDEN,
  ERROR_PRODUCT_BASKET_NOT_FOUND,
} from './product-baskets.constants';
import { ProductBasketsMapper } from './product-baskets.mapper';
import { NotFoundError } from '../../common/exceptions/not-found.error';
import { ForbiddenError } from '../../common/exceptions/forbidden.error';

@Injectable()
export class ProductBasketsService {
  constructor(
    private readonly productBasketsRepository: ProductBasketsRepository,
    private readonly mapper: ProductBasketsMapper,
  ) {}

  async addProductToBasket(addProductDto: AddProductToBasketRequest) {
    const findedProductBasket = await this.productBasketsRepository.findProductBasketByUserIdAndProductId(
      addProductDto.userId,
      addProductDto.productId,
    );
    if (findedProductBasket) {
      throw new ConflictError(ERROR_ITEM_IS_ALREADY_BASKET);
    }

    const newProductBasket = this.createProductBasketEntity(addProductDto);
    await this.productBasketsRepository.save(newProductBasket);
    return this.getProductBasket({ userId: addProductDto.userId });
  }

  async getProductBasket({ userId }: UserBasketRequest): Promise<UserBasketResponse> {
    const productBaskets = await this.productBasketsRepository.findProductBasketsByUserId(userId);
    return this.mapper.mapAll(productBaskets);
  }

  async updateProductToBasket(updateDto: UpdateProductToBasketRequest): Promise<UserBasketResponse> {
    const productBasket = await this.productBasketsRepository.findProductBasketById(updateDto.basketId);
    if (!productBasket) {
      throw new NotFoundError(ERROR_PRODUCT_BASKET_NOT_FOUND);
    }
    if (productBasket.userId !== updateDto.userId) {
      throw new ForbiddenError(ERROR_PRODUCT_BASKET_FORBIDDEN);
    }
    const entity = this.createProductBasketEntity(updateDto);
    entity.id = productBasket.id;

    await this.productBasketsRepository.save(entity);
    return this.getProductBasket({ userId: updateDto.userId });
  }

  async deleteProductInBasket(deleteDto: DeleteProductInBasketRequest): Promise<UserBasketResponse> {
    const productBasket = await this.productBasketsRepository.findProductBasketById(deleteDto.basketId);
    if (productBasket && productBasket.userId !== deleteDto.userId) {
      throw new ForbiddenError(ERROR_PRODUCT_BASKET_FORBIDDEN);
    }

    await this.productBasketsRepository.deleteProductBaskets([productBasket]);
    return this.getProductBasket({ userId: deleteDto.userId });
  }

  async clearTheBasket({ userId }: UserBasketRequest): Promise<UserBasketResponse> {
    const productBaskets = await this.productBasketsRepository.findProductBasketsByUserId(userId);
    if (productBaskets.length) {
      await this.productBasketsRepository.deleteProductBaskets(productBaskets);
    }
    return { products: [] };
  }

  private createProductBasketEntity(createDto: AddProductToBasketRequest) {
    const productBasket = new ProductBasketEntity();
    productBasket.userId = createDto.userId;
    productBasket.productId = createDto.productId;
    productBasket.quantity = createDto.quantity;

    return productBasket;
  }
}
