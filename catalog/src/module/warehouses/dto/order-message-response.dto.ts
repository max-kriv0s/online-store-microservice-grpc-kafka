import { OrderMessageResponse } from '../interfaces/order-message-response.interface';

export class OrderMessageResponseDto implements OrderMessageResponse {
  orderId: string;
  success: boolean;
  error: string;

  constructor(orderId: string, error?: string) {
    this.orderId = orderId;
    this.success = true;
    this.error = '';
  }

  setErrors(error: string) {
    this.success = false;
    this.error = error;
  }
}
