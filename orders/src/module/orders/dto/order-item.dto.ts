import { Item } from "../interfaces/orders.interface";

export class OrderItemDto implements Item {
    productId: string;
    quantity: number;
    unitPrice: number;
    sum: number;
}