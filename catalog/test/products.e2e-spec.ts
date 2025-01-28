import { microservice, grpcProxy } from './test-grpc-setup';
import { getRandomString, truncateDbTables } from './test-utils';
import {
  CreateProductRequest,
  FindAllProductsRequest,
  FindProductRequest,
  GetProductsByIdsResponse,
  ProductResponse,
  PRODUCTS_SERVICE_NAME,
  ProductsResponse,
  ProductsServiceClient,
  UpdateProductRequest,
} from '@/module/products/interfaces/products.interface';
import { ProductsHelper } from './helpers/products.helper';
import {
  CATEGORIES_SERVICE_NAME,
  CategoriesServiceClient,
  CategoryResponse,
} from '@/module/categories/interfaces/categories.interface';
import { CategoriesHelper } from './helpers/categories.helper';
import { PRODUCT_VALIDATION } from '@/module/products/products.constants';

describe('ProductsController (e2e)', () => {
  let productsService: ProductsServiceClient;
  let productsHelper: ProductsHelper;

  let categoriesService: CategoriesServiceClient;
  let categoriesHelper: CategoriesHelper;
  let category: CategoryResponse;
  let categoryId: string;

  beforeEach(async () => {
    await truncateDbTables(microservice);

    productsService = grpcProxy.getService(PRODUCTS_SERVICE_NAME);
    productsHelper = new ProductsHelper(productsService);

    categoriesService = grpcProxy.getService(CATEGORIES_SERVICE_NAME);
    categoriesHelper = new CategoriesHelper(categoriesService);

    const createCategoryDto = categoriesHelper.getCreateCategoryDto();
    category = await categoriesHelper.createCategory(createCategoryDto);
    categoryId = category.id;
  });

  describe('Create product', () => {
    it('Should be successfully created product', async () => {
      const createDto = productsHelper.getCreateProductDto(categoryId);

      const createdProduct = await productsHelper.createProduct(createDto);

      const expectedResult: ProductResponse = {
        id: expect.any(String),
        name: createDto.name,
        description: createDto.description,
        categoryId: category.id,
        price: 0,
      };
      expect(createdProduct).toEqual(expectedResult);
    });

    it('Should be an error exceeding the maximum length of the name', async () => {
      const productName = getRandomString(PRODUCT_VALIDATION.name.maxLength + 1);
      const createDto = productsHelper.getCreateProductDto(categoryId, productName);

      const expectMessage = `3 INVALID_ARGUMENT: [{"key":"name","message":"name must be shorter than or equal to ${PRODUCT_VALIDATION.name.maxLength} characters"}]`;
      await expect(productsHelper.createProduct(createDto)).rejects.toThrow(expectMessage);
    });

    it('Should be an error the minimal length of the name', async () => {
      const productName = getRandomString(PRODUCT_VALIDATION.name.minLength - 1);
      const createDto: CreateProductRequest = productsHelper.getCreateProductDto(categoryId, productName);

      const expectMessage = `3 INVALID_ARGUMENT: [{"key":"name","message":"name must be longer than or equal to ${PRODUCT_VALIDATION.name.minLength} characters"}]`;
      await expect(productsHelper.createProduct(createDto)).rejects.toThrow(expectMessage);
    });
  });

  describe('Update product', () => {
    it('Should be successfully updated product', async () => {
      const createDto = productsHelper.getCreateProductDto(categoryId);
      const createdProduct = await productsHelper.createProduct(createDto);

      const newName = 'new product';
      const updateDto: UpdateProductRequest = {
        id: createdProduct.id,
        name: newName,
      };

      const updatedProduct = await productsHelper.updateProduct(updateDto);

      const expectedResult: ProductResponse = {
        id: createdProduct.id,
        name: newName,
        description: createDto.description,
        categoryId: createDto.categoryId,
        price: expect.any(Number),
      };
      expect(updatedProduct).toEqual(expectedResult);
    });

    it('Should be error product not found', async () => {
      const updateDto: UpdateProductRequest = {
        id: crypto.randomUUID(),
        name: 'Product 1',
      };

      const expectMessage = '5 NOT_FOUND: Product not found';
      await expect(productsHelper.updateProduct(updateDto)).rejects.toThrow(expectMessage);
    });
  });

  describe('Delete product', () => {
    it('Should be successfully deleted product', async () => {
      const createDto = productsHelper.getCreateProductDto(categoryId);

      const createdProduct = await productsHelper.createProduct(createDto);
      await productsHelper.deleteProduct({ id: createdProduct.id });

      const expectMessage = '5 NOT_FOUND: Product not found';
      await expect(productsHelper.findProduct({ id: createdProduct.id })).rejects.toThrow(expectMessage);
    });
  });

  describe('Find product', () => {
    it('Should be successfully finded product', async () => {
      const createDto = productsHelper.getCreateProductDto(categoryId);
      const createdProduct = await productsHelper.createProduct(createDto);

      const findedProduct = await productsHelper.findProduct({ id: createdProduct.id });

      const expectedResult: ProductResponse = {
        id: createdProduct.id,
        name: createDto.name,
        description: createDto.description,
        categoryId: createDto.categoryId,
        price: expect.any(Number),
      };
      expect(findedProduct).toEqual(expectedResult);
    });

    it('Should be error product not found', async () => {
      const dto: FindProductRequest = {
        id: crypto.randomUUID(),
      };

      const expectMessage = '5 NOT_FOUND: Product not found';
      await expect(productsHelper.findProduct(dto)).rejects.toThrow(expectMessage);
    });

    it('Should be successfully finded products by category', async () => {
      const createCategoryDto = categoriesHelper.getCreateCategoryDto();
      const category = await categoriesHelper.createCategory(createCategoryDto);

      const createDto = productsHelper.getCreateProductDto(category.id);
      const createdProduct = await productsHelper.createProduct(createDto);

      const searchParams: FindAllProductsRequest = { categoriesIds: [category.id], sortBy: [] };
      const findedProducts = await productsHelper.findAllProducts(searchParams);

      const expectedResult: ProductsResponse = {
        pagesCount: 1,
        page: 1,
        pageSize: expect.any(Number),
        totalCount: 1,
        items: [
          {
            ...createDto,
            id: createdProduct.id,
            price: createdProduct.price,
          },
        ],
      };

      expect(findedProducts).toEqual(expectedResult);
    });
  });

  describe('Get products by ids', () => {
    it('Should be successfully get products by ids', async () => {
      const createDto = productsHelper.getCreateProductDto(categoryId);
      const createdProduct = await productsHelper.createProduct(createDto);

      const productsByIds = await productsHelper.getProductsByIds({ ids: [createdProduct.id] });

      const expectedResult: GetProductsByIdsResponse = {
        products: [
          {
            id: createdProduct.id,
            name: createDto.name,
            description: createDto.description,
            categoryId: createDto.categoryId,
            price: expect.any(Number),
          },
        ],
      };
      expect(productsByIds).toEqual(expectedResult);
    });
  });
});
