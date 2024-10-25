export interface OrderMessageCreate {
  orderId: string;
  date: Date;
  totalSum: number;
  customerId: string;
  items: Item[];
  createdAt: Date;
}

export interface Item {
  productId: string;
  quantity: number;
  unitPrice: number;
  sum: number;
}
