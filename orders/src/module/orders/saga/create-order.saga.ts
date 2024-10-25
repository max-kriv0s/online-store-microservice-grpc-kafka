import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { OrderEntity } from '../entities/order.entity';
import { Step } from './steps/step';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CheckProductsAvailibityStep } from './steps/check-products-availibity.step';
import { ClearProductBasketStep, ConfirmOrderStep, UpdateStockStep } from './steps';

type OrderStep = Step<OrderEntity, void>;

@Injectable()
export class CreateOrderSaga {
  private successfulSteps: OrderStep[] = [];

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    private readonly checkProductsAvailibityStep: CheckProductsAvailibityStep,
    private readonly updateStockStep: UpdateStockStep,
    private readonly confirmOrderStep: ConfirmOrderStep,
    private readonly clearProductBasketStep: ClearProductBasketStep,
  ) {}

  async execute(order: OrderEntity): Promise<void> {
    try {
      await this.invokeSagaStep(order, this.checkProductsAvailibityStep);
      await this.invokeSagaStep(order, this.confirmOrderStep);
      await this.invokeSagaStep(order, this.updateStockStep);
      await this.invokeSagaStep(order, this.clearProductBasketStep);

      this.logger.log(`Order Creation Transaction ended successfuly. OrderId: ${order.id}`, CreateOrderSaga.name);
    } catch (error) {
      this.successfulSteps.forEach(async (step) => {
        this.logger.log(`Rollbacking: ${step.name}`, CreateOrderSaga.name);
        await step.withCompenstion(order);
      });
      this.logger.error(`Order Creation Transaction ended fail. OrderId: ${order.id}`, CreateOrderSaga.name);
    }
  }

  private async invokeSagaStep(order: OrderEntity, step: OrderStep) {
    try {
      this.logger.log(`Invoking: ${step.name}`, CreateOrderSaga.name);
      await step.invoke(order);
      this.successfulSteps.unshift(step);
    } catch (error) {
      this.logger.error(`Failed Step: ${step.name}`, error.stack, CreateOrderSaga.name);
      throw error;
    }
  }
}
