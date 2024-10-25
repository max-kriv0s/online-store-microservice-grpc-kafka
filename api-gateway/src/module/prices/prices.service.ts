import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AddProductPriceRequest,
  DeleteProductPriceRequest,
  GetProductsPricesRequest,
  PRICES_SERVICE_NAME,
  PricesServiceClient,
  UpdateProductPriceRequest,
} from './interfaces/prices-service.interface';
import { PRICES_CLIENT_NAME } from './prices.constants';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PricesMapper } from './prices.mapper';
import { ProductPriceResponseDto } from './dto/product-price-response.dto';

@Injectable()
export class PricesService implements OnModuleInit {
  private pricesService: PricesServiceClient;

  constructor(
    @Inject(PRICES_CLIENT_NAME) private client: ClientGrpc,
    private readonly mapper: PricesMapper,
  ) {}

  onModuleInit() {
    this.pricesService = this.client.getService<PricesServiceClient>(PRICES_SERVICE_NAME);
  }

  private getMetadate(): Metadata {
    return new Metadata();
  }

  async addProductPrice(addPriceDto: AddProductPriceRequest): Promise<ProductPriceResponseDto> {
    const price = await firstValueFrom(
      this.pricesService
        .addProductPrice(addPriceDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    return this.mapper.map(price);
  }

  async updateProductPrice(updatePriceDto: UpdateProductPriceRequest): Promise<ProductPriceResponseDto> {
    const price = await firstValueFrom(
      this.pricesService
        .updateProductPrice(updatePriceDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    return this.mapper.map(price);
  }

  async deleteProductPrice(deletePriceDto: DeleteProductPriceRequest): Promise<void> {
    await firstValueFrom(
      this.pricesService
        .deleteProductPrice(deletePriceDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async getProductsPrices(getPricesDto: GetProductsPricesRequest): Promise<ProductPriceResponseDto[]> {
    const prices = await firstValueFrom(
      this.pricesService
        .getProductsPrices(getPricesDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    return this.mapper.mapAll(prices);
  }

  async getCurrentPricesProducts(getCurrentPriceDto: GetProductsPricesRequest): Promise<ProductPriceResponseDto[]> {
    const prices = await firstValueFrom(
      this.pricesService
        .getCurrentPricesProducts(getCurrentPriceDto, this.getMetadate())
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
    return this.mapper.mapAll(prices);
  }
}
