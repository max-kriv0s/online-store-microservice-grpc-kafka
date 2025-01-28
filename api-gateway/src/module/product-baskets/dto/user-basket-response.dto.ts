export class UserBasketResponseDto {
  products: UserBasketProduct[];
}

export class UserBasketProduct {
  basketId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  sum: number;
}
