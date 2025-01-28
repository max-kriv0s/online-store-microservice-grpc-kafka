import { CATEGORIES_SERVICE_NAME, CategoriesServiceClient } from '@/module/categories/interfaces/categories.interface';
import { grpcProxy, microservice } from './test-grpc-setup';
import { convertNumberPeriodToStartOfDay, truncateDbTables } from './test-utils';
import { CategoriesHelper } from './helpers/categories.helper';
import { PRODUCTS_SERVICE_NAME, ProductsServiceClient } from '@/module/products/interfaces/products.interface';
import { ProductsHelper } from './helpers/products.helper';
import {
  PRICES_SERVICE_NAME,
  PricesServiceClient,
  ProductPriceResponse,
  UpdateProductPriceRequest,
} from '@/module/prices/interfaces/prices.interface';
import { PricesHelper } from './helpers/prices.helper';
import { ERROR_PRICE_ALREADY_ASSIGNED, ERROR_PRICE_NOT_FOUND } from '@/module/prices/prices.constants';

describe('PricesController (e2e)', () => {
  let pricesHelper: PricesHelper;
  let productId: string;

  beforeEach(async () => {
    await truncateDbTables(microservice);

    const categoriesService: CategoriesServiceClient = grpcProxy.getService(CATEGORIES_SERVICE_NAME);
    const categoriesHelper = new CategoriesHelper(categoriesService);

    const createCategoryDto = categoriesHelper.getCreateCategoryDto();
    const category = await categoriesHelper.createCategory(createCategoryDto);

    const productsService: ProductsServiceClient = grpcProxy.getService(PRODUCTS_SERVICE_NAME);
    const productsHelper = new ProductsHelper(productsService);

    const createProductDto = productsHelper.getCreateProductDto(category.id);
    const product = await productsHelper.createProduct(createProductDto);
    productId = product.id;

    const pricesService: PricesServiceClient = grpcProxy.getService(PRICES_SERVICE_NAME);
    pricesHelper = new PricesHelper(pricesService);
  });

  describe('Add price', () => {
    it('Should be successfully added price by product', async () => {
      const addPriceDto = pricesHelper.getAddPricesDto('2024-12-01', productId, 100);

      const addedPrice = await pricesHelper.addProductPrice(addPriceDto);
      const transformResponse = { ...addedPrice, period: Number(addedPrice.period) };

      const expectedResult: ProductPriceResponse = {
        id: expect.any(String),
        period: convertNumberPeriodToStartOfDay(addPriceDto.period),
        productId: addPriceDto.productId,
        price: addPriceDto.price,
      };
      expect(transformResponse).toEqual(expectedResult);
    });

    it('Should be error - Price already assigned', async () => {
      const addPriceDto = pricesHelper.getAddPricesDto('2024-12-02', productId, 100);
      await pricesHelper.addProductPrice(addPriceDto);

      const expectMessage = `6 ALREADY_EXISTS: ${ERROR_PRICE_ALREADY_ASSIGNED}`;
      await expect(pricesHelper.addProductPrice(addPriceDto)).rejects.toThrow(expectMessage);
    });
  });

  describe('Update price', () => {
    it('Should be successfully updated price by product', async () => {
      const addPriceDto = pricesHelper.getAddPricesDto('2024-12-01', productId, 100);
      const addedPrice = await pricesHelper.addProductPrice(addPriceDto);

      const updateDto: UpdateProductPriceRequest = {
        id: addedPrice.id,
        price: 150,
      };

      const updatedPrice = await pricesHelper.updateProductPrice(updateDto);
      const transformResponse = { ...updatedPrice, period: Number(updatedPrice.period) };

      const expectedResult: ProductPriceResponse = {
        id: addedPrice.id,
        period: convertNumberPeriodToStartOfDay(addPriceDto.period),
        productId: addPriceDto.productId,
        price: updateDto.price,
      };
      expect(transformResponse).toEqual(expectedResult);
    });

    it('Should be error - Price not found', async () => {
      const updateDto: UpdateProductPriceRequest = {
        id: crypto.randomUUID(),
        price: 150,
      };

      const expectMessage = `5 NOT_FOUND: ${ERROR_PRICE_NOT_FOUND}`;
      await expect(pricesHelper.updateProductPrice(updateDto)).rejects.toThrow(expectMessage);
    });
  });

  describe('Delete price', () => {
    it('Should be successfully deleted price', async () => {
      const addPriceDto = pricesHelper.getAddPricesDto('2024-12-01', productId, 100);
      const addedPrice = await pricesHelper.addProductPrice(addPriceDto);

      await pricesHelper.deleteProductPrice({ id: addedPrice.id });
      const findedProducts = await pricesHelper.getProductsPrices({ productsIds: [productId] });

      expect(findedProducts.hasOwnProperty('productsPrices')).toBeFalsy();
    });
  });

  describe('Get products prices', () => {
    it('Should be successfully get price by product', async () => {
      const addPriceDto1 = pricesHelper.getAddPricesDto('2024-12-01', productId, 100);
      const addedPrice1 = await pricesHelper.addProductPrice(addPriceDto1);

      const addPriceDto2 = pricesHelper.getAddPricesDto('2024-12-02', productId, 150);
      const addedPrice2 = await pricesHelper.addProductPrice(addPriceDto2);

      const findedProducts = await pricesHelper.getProductsPrices({ productsIds: [productId] });

      expect(findedProducts.hasOwnProperty('productsPrices')).toBeTruthy();
      expect(findedProducts.productsPrices.length).toBe(2);

      const price1 = findedProducts.productsPrices[0];
      const transformPrice1 = { ...price1, period: Number(price1.period) };

      const price2 = findedProducts.productsPrices[1];
      const transformPrice2 = { ...price2, period: Number(price2.period) };

      const expectedResult1: ProductPriceResponse = {
        id: addedPrice1.id,
        period: convertNumberPeriodToStartOfDay(addPriceDto1.period),
        productId: addPriceDto1.productId,
        price: addPriceDto1.price,
      };
      expect(transformPrice1).toEqual(expectedResult1);

      const expectedResult2: ProductPriceResponse = {
        id: addedPrice2.id,
        period: convertNumberPeriodToStartOfDay(addPriceDto2.period),
        productId: addPriceDto2.productId,
        price: addPriceDto2.price,
      };
      expect(transformPrice2).toEqual(expectedResult2);
    });
  });

  describe('Get current prices products', () => {
    it('Should be successfully get current price by product', async () => {
      const addPriceDto1 = pricesHelper.getAddPricesDto('2024-12-01', productId, 100);
      const addPriceDto2 = pricesHelper.getAddPricesDto('2024-12-02', productId, 150);

      await pricesHelper.addProductPrice(addPriceDto1);
      const addedPrice = await pricesHelper.addProductPrice(addPriceDto2);

      const findedProducts = await pricesHelper.getCurrentPricesProducts({ productsIds: [productId] });

      expect(findedProducts.hasOwnProperty('productsPrices')).toBeTruthy();
      expect(findedProducts.productsPrices.length).toBe(1);

      const price = findedProducts.productsPrices[0];
      const transformPrice = { ...price, period: Number(price.period) };

      const expectedResult: ProductPriceResponse = {
        id: addedPrice.id,
        period: convertNumberPeriodToStartOfDay(addPriceDto2.period),
        productId: addPriceDto2.productId,
        price: addPriceDto2.price,
      };
      expect(transformPrice).toEqual(expectedResult);
    });
  });
});
