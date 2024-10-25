import { CheckProductsAvailibityStep } from './check-products-availibity.step';
import { ClearProductBasketStep } from './clear-product-basket.step';
import { ConfirmOrderStep } from './confirm-order.step';
import { UpdateStockStep } from './update-stock.step';

export * from './check-products-availibity.step';
export * from './update-stock.step';
export * from './confirm-order.step';
export * from './clear-product-basket.step';

export const OrderSagaSteps = [CheckProductsAvailibityStep, UpdateStockStep, ConfirmOrderStep, ClearProductBasketStep];
