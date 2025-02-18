// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.3
//   protoc               unknown
// source: product-baskets.proto

/* eslint-disable */
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export interface Empty {}

export interface Product {
  basketId: string;
  productId: string;
  quantity: number;
}

export interface UserBasketResponse {
  products: Product[];
}

export interface AddProductToBasketRequest {
  userId: string;
  productId: string;
  quantity: number;
}

export interface UpdateProductToBasketRequest {
  basketId: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface DeleteProductInBasketRequest {
  basketId: string;
  userId: string;
}

export interface UserBasketRequest {
  userId: string;
}

export interface ProductBasketsServiceClient {
  addProductToBasket(
    request: AddProductToBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<UserBasketResponse>;

  updateProductToBasket(
    request: UpdateProductToBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<UserBasketResponse>;

  deleteProductInBasket(
    request: DeleteProductInBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<UserBasketResponse>;

  clearTheBasket(request: UserBasketRequest, metadata: Metadata, ...rest: any): Observable<UserBasketResponse>;

  getProductBasket(request: UserBasketRequest, metadata: Metadata, ...rest: any): Observable<UserBasketResponse>;
}

export interface ProductBasketsServiceController {
  addProductToBasket(
    request: AddProductToBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserBasketResponse> | Observable<UserBasketResponse> | UserBasketResponse;

  updateProductToBasket(
    request: UpdateProductToBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserBasketResponse> | Observable<UserBasketResponse> | UserBasketResponse;

  deleteProductInBasket(
    request: DeleteProductInBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserBasketResponse> | Observable<UserBasketResponse> | UserBasketResponse;

  clearTheBasket(
    request: UserBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserBasketResponse> | Observable<UserBasketResponse> | UserBasketResponse;

  getProductBasket(
    request: UserBasketRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserBasketResponse> | Observable<UserBasketResponse> | UserBasketResponse;
}

export function ProductBasketsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'addProductToBasket',
      'updateProductToBasket',
      'deleteProductInBasket',
      'clearTheBasket',
      'getProductBasket',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('ProductBasketsService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('ProductBasketsService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_BASKETS_SERVICE_NAME = 'ProductBasketsService';
