import {
  AddProductPriceRequest,
  DeleteProductPriceRequest,
  GetProductsPricesRequest,
  PricesServiceClient,
  ProductPriceResponse,
  ProductsPricesResponse,
  UpdateProductPriceRequest,
} from '@/module/prices/interfaces/prices.interface';
import { Metadata } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { dateStringToNumber } from '../test-utils';

export class PricesHelper {
  private metadata = new Metadata();
  constructor(private readonly pricesService: PricesServiceClient) {}

  getAddPricesDto(dateString: string, productId: string, price: number): AddProductPriceRequest {
    return {
      period: dateStringToNumber(dateString),
      productId,
      price,
    };
  }

  async addProductPrice(addPriceDto: AddProductPriceRequest): Promise<ProductPriceResponse> {
    return firstValueFrom(
      this.pricesService
        .addProductPrice(addPriceDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async updateProductPrice(updatePriceDto: UpdateProductPriceRequest): Promise<ProductPriceResponse> {
    return firstValueFrom(
      this.pricesService
        .updateProductPrice(updatePriceDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async deleteProductPrice(deletePriceDto: DeleteProductPriceRequest): Promise<void> {
    await firstValueFrom(
      this.pricesService
        .deleteProductPrice(deletePriceDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async getProductsPrices(getPricesDto: GetProductsPricesRequest): Promise<ProductsPricesResponse> {
    return firstValueFrom(
      this.pricesService
        .getProductsPrices(getPricesDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }

  async getCurrentPricesProducts(getCurrentPriceDto: GetProductsPricesRequest): Promise<ProductsPricesResponse> {
    return firstValueFrom(
      this.pricesService
        .getCurrentPricesProducts(getCurrentPriceDto, this.metadata)
        .pipe(catchError((error) => throwError(() => new RpcException(error)))),
    );
  }
}
