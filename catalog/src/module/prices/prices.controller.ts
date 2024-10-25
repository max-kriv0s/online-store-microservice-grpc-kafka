import { Controller } from '@nestjs/common';
import {
  PRICES_SERVICE_NAME,
  PricesServiceController,
  PricesServiceControllerMethods,
  ProductPriceResponse,
  ProductsPricesResponse,
} from './interfaces/prices.interface';
import { GrpcMethod } from '@nestjs/microservices';
import { AddPriceDto } from './dto/add-price.dto';
import { PricesService } from './prices.service';
import { DeletePriceDto } from './dto/delete-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { GetProductsPricesDto } from './dto/get-prices.dto';

@Controller('prices')
@PricesServiceControllerMethods()
export class PricesController implements PricesServiceController {
  constructor(private readonly pricesService: PricesService) {}

  @GrpcMethod(PRICES_SERVICE_NAME)
  async addProductPrice(addPriceDto: AddPriceDto): Promise<ProductPriceResponse> {
    return this.pricesService.addProductPrice(addPriceDto);
  }

  @GrpcMethod(PRICES_SERVICE_NAME)
  async updateProductPrice(updatePriceDto: UpdatePriceDto): Promise<ProductPriceResponse> {
    return this.pricesService.updateProductPrice(updatePriceDto);
  }

  @GrpcMethod(PRICES_SERVICE_NAME)
  async deleteProductPrice(deletePriceDto: DeletePriceDto): Promise<void> {
    await this.pricesService.deleteProductPrice(deletePriceDto.id);
  }

  @GrpcMethod(PRICES_SERVICE_NAME)
  async getProductsPrices(pricesDto: GetProductsPricesDto): Promise<ProductsPricesResponse> {
    return this.pricesService.getProductsPrices(pricesDto);
  }

  @GrpcMethod(PRICES_SERVICE_NAME)
  async getCurrentPricesProducts(pricesDto: GetProductsPricesDto): Promise<ProductsPricesResponse> {
    return this.pricesService.getCurrentPricesProducts(pricesDto);
  }
}
