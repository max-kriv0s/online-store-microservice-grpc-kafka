export interface KafkaCreateOrderMessage {
  orderId: string;
  date: Date;
  totalSum: number;
  customerId: string;
  items: Item[];
  createdAt: Date;
}

interface Item {
  productId: string;
  quantity: number;
  unitPrice: number;
  sum: number;
}
