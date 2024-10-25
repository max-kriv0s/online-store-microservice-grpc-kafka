import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './repositories/products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsMapper } from './products.mapper';
import { ProductEntity } from './entities/product.entity';
import {
  CreateProductRequest,
  ProductResponse,
  ProductsResponse,
  UpdateProductRequest,
} from './interfaces/products.interface';
import { ERROR_PRODUCT_NOT_FOUND, PAGE_NUMBER_DEFAULT, PAGE_SIZE_DEFAULT } from './products.constants';
import { NotFoundError } from '../../common/exceptions/not-found.error';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { ProductsPagination } from './dto/all-products-response.dto';
import { SearchProductsParams } from './interfaces/products-service.interface';
import { SortDirection } from '../../common/pagination';
import { PricesService } from '../prices/prices.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly mapper: ProductsMapper,
    private readonly pricesService: PricesService,
  ) {}

  async createProduct(createDto: CreateProductRequest): Promise<ProductResponse> {
    const newProduct = this.createProductEntity(createDto);
    const product = await this.productsRepository.save(newProduct);
    return this.mapper.map(product);
  }

  async updateProduct(updateDto: UpdateProductRequest): Promise<ProductResponse> {
    const product = await this.productsRepository.findProductById(updateDto.id);
    if (!product) {
      throw new NotFoundError(ERROR_PRODUCT_NOT_FOUND);
    }

    product.name = updateDto.name ?? product.name;
    product.description = updateDto.description ?? product.description;
    product.categoryId = updateDto.categoryId ?? product.categoryId;

    const updatedProduct = await this.productsRepository.save(product);
    const price = await this.getProductCurrentPrice(updatedProduct);

    return this.mapper.map(updatedProduct, price);
  }

  async deleteProduct(productId: string): Promise<void> {
    return this.productsRepository.delete(productId);
  }

  async findProductById(productId: string): Promise<ProductResponse> {
    const product = await this.productsRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundError(ERROR_PRODUCT_NOT_FOUND);
    }

    const price = await this.getProductCurrentPrice(product);
    return this.mapper.map(product, price);
  }

  async findAllProducts(findAllDto: FindAllProductsDto): Promise<ProductsResponse> {
    const searchParam = this.getSearchProductsParams(findAllDto);
    const [products, total] = await this.productsRepository.findAllProductsAndCount(searchParam);

    const paginator = new ProductsPagination(searchParam.pageNumber, searchParam.pageSize);
    const productsIds = products.map((product) => product.id);

    const { productsPrices } = await this.pricesService.getCurrentPricesProducts({ productsIds });
    const items = this.mapper.mapAll(products, productsPrices);
    const pag = paginator.paginate(total, items);
    return pag;
  }

  private createProductEntity(createDto: CreateProductDto): ProductEntity {
    const product = new ProductEntity();
    product.name = createDto.name;
    product.description = createDto.description;
    product.categoryId = createDto.categoryId;

    return product;
  }

  private getSearchProductsParams(findAllDto: FindAllProductsDto): SearchProductsParams {
    const pageNumber = findAllDto.pageNumber || PAGE_NUMBER_DEFAULT;
    const pageSize = findAllDto.pageSize || PAGE_SIZE_DEFAULT;
    const skip = (pageNumber - 1) * pageSize;

    const sortBy = findAllDto.sortBy ?? [];
    if (!sortBy.length) {
      sortBy.push({ field: 'createdAt', direction: SortDirection.desc });
    }

    const categoriesIds = findAllDto.categoriesIds ?? [];

    return {
      pageNumber,
      pageSize,
      skip,
      sortBy,
      categoriesIds,
    };
  }

  private async getProductCurrentPrice(product: ProductEntity): Promise<number> {
    const { productsPrices } = await this.pricesService.getCurrentPricesProducts({ productsIds: [product.id] });
    if (productsPrices.length) {
      return productsPrices[0].price;
    }
    return 0;
  }
}
