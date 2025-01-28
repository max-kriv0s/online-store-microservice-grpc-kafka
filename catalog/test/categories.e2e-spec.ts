import {
  CATEGORIES_SERVICE_NAME,
  CategoriesServiceClient,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../src/module/categories/interfaces/categories.interface';
import { microservice, grpcProxy } from './test-grpc-setup';
import { getRandomString, truncateDbTables } from './test-utils';
import { CATEGORY_VALIDATION } from '@/module/categories/categories.constants';
import { CategoriesHelper } from './helpers/categories.helper';

describe('CategoriesController (e2e)', () => {
  let categoriesService: CategoriesServiceClient;
  let categoriesHelper: CategoriesHelper;
  beforeEach(async () => {
    await truncateDbTables(microservice);

    categoriesService = grpcProxy.getService(CATEGORIES_SERVICE_NAME);
    categoriesHelper = new CategoriesHelper(categoriesService);
  });

  describe('Create category', () => {
    it('Should be successfully created category', async () => {
      const createDto = categoriesHelper.getCreateCategoryDto();

      const createdCategorie = await categoriesHelper.createCategory(createDto);

      const expectedResult: CategoryResponse = {
        id: expect.any(String),
        name: createDto.name,
        description: createDto.description,
      };
      expect(createdCategorie).toEqual(expectedResult);
    });

    it('Should be error "Category name not unique"', async () => {
      const createDto = categoriesHelper.getCreateCategoryDto();

      await categoriesHelper.createCategory(createDto);

      const expectMessage = '6 ALREADY_EXISTS: Category name not unique';
      await expect(categoriesHelper.createCategory(createDto)).rejects.toThrow(expectMessage);
    });

    it('Should be error incorrect name', async () => {
      const categoryName = getRandomString(CATEGORY_VALIDATION.name.length + 1);
      const createDto = categoriesHelper.getCreateCategoryDto(categoryName);

      const expectMessage = `3 INVALID_ARGUMENT: [{"key":"name","message":"name must be shorter than or equal to ${CATEGORY_VALIDATION.name.length} characters"}]`;
      await expect(categoriesHelper.createCategory(createDto)).rejects.toThrow(expectMessage);
    });
  });

  describe('update categorie', () => {
    it('Should be successfully updated category', async () => {
      const createDto = categoriesHelper.getCreateCategoryDto();
      const createdCategory = await categoriesHelper.createCategory(createDto);

      const updateDto: UpdateCategoryRequest = {
        id: createdCategory.id,
        name: 'new Category',
        description: 'new Description',
      };
      const updatedCategory = await categoriesHelper.updateCategory(updateDto);

      expect(updatedCategory).toEqual(updateDto);
    });

    it('Should be error category not found', async () => {
      const updateDto: UpdateCategoryRequest = {
        id: crypto.randomUUID(),
        name: 'new Category',
        description: 'new Description',
      };

      const expectMessage = '5 NOT_FOUND: Category not found';
      await expect(categoriesHelper.updateCategory(updateDto)).rejects.toThrow(expectMessage);
    });

    it('Should be error incorrect id', async () => {
      const updateDto: UpdateCategoryRequest = {
        id: '1',
        name: 'new Category',
        description: 'new Description',
      };

      const expectMessage = `3 INVALID_ARGUMENT: [{\"key\":\"id\",\"message\":\"id must be a UUID\"}]`;
      await expect(categoriesHelper.updateCategory(updateDto)).rejects.toThrow(expectMessage);
    });

    it('Should be error incorrect name', async () => {
      const createDto: CreateCategoryRequest = {
        name: 'Category 1',
        description: 'Description category 1',
      };

      const createdCategory = await categoriesHelper.createCategory(createDto);

      const updateDto: UpdateCategoryRequest = {
        id: createdCategory.id,
        name: getRandomString(151),
        description: 'new Description',
      };

      const expectMessage = `3 INVALID_ARGUMENT: [{"key":"name","message":"name must be shorter than or equal to ${CATEGORY_VALIDATION.name.length} characters"}]`;
      await expect(categoriesHelper.updateCategory(updateDto)).rejects.toThrow(expectMessage);
    });
  });

  describe('delete category', () => {
    it('Should be successfully deleted category', async () => {
      const createDto = categoriesHelper.getCreateCategoryDto();

      const createdCategory = await categoriesHelper.createCategory(createDto);
      await categoriesHelper.deleteCategory({ id: createdCategory.id });

      const expectMessage = '5 NOT_FOUND: Category not found';
      await expect(categoriesHelper.findCategory({ id: createdCategory.id })).rejects.toThrow(expectMessage);
    });

    it('Should be error incorrect id', async () => {
      const expectMessage = `3 INVALID_ARGUMENT: [{\"key\":\"id\",\"message\":\"id must be a UUID\"}]`;
      await expect(categoriesHelper.deleteCategory({ id: '1' })).rejects.toThrow(expectMessage);
    });
  });

  describe('find categories', () => {
    it('Should be successfully deleted category', async () => {
      const createDto = categoriesHelper.getCreateCategoryDto();
      const createdCategory = await categoriesHelper.createCategory(createDto);

      const finedCategory = await categoriesHelper.findCategory({ id: createdCategory.id });

      expect(finedCategory).toEqual(createdCategory);
    });
  });
});
