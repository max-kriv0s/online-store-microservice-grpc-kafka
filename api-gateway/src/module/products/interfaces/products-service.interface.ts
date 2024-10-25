// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.3
//   protoc               unknown
// source: products.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const SortDirection = { desc: "desc", asc: "asc", UNRECOGNIZED: "UNRECOGNIZED" } as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];

export namespace SortDirection {
  export type desc = typeof SortDirection.desc;
  export type asc = typeof SortDirection.asc;
  export type UNRECOGNIZED = typeof SortDirection.UNRECOGNIZED;
}

export interface SortQuery {
  field: string;
  direction: SortDirection;
}

export interface Empty {
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
}

export interface ProductsResponse {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: ProductResponse[];
}

export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: string;
}

export interface UpdateProductRequest {
  id: string;
  name?: string | undefined;
  description?: string | undefined;
  categoryId?: string | undefined;
}

export interface DeleteProductRequest {
  id: string;
}

export interface FindProductRequest {
  id: string;
}

export interface FindAllProductsRequest {
  pageNumber?: number | undefined;
  pageSize?: number | undefined;
  categoriesIds: string[];
  sortBy: SortQuery[];
}

export interface ProductsServiceClient {
  create(request: CreateProductRequest, metadata: Metadata, ...rest: any): Observable<ProductResponse>;

  update(request: UpdateProductRequest, metadata: Metadata, ...rest: any): Observable<ProductResponse>;

  delete(request: DeleteProductRequest, metadata: Metadata, ...rest: any): Observable<Empty>;

  findProduct(request: FindProductRequest, metadata: Metadata, ...rest: any): Observable<ProductResponse>;

  findAllProducts(request: FindAllProductsRequest, metadata: Metadata, ...rest: any): Observable<ProductsResponse>;
}

export interface ProductsServiceController {
  create(
    request: CreateProductRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<ProductResponse> | Observable<ProductResponse> | ProductResponse;

  update(
    request: UpdateProductRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<ProductResponse> | Observable<ProductResponse> | ProductResponse;

  delete(request: DeleteProductRequest, metadata: Metadata, ...rest: any): Promise<Empty> | Observable<Empty> | Empty;

  findProduct(
    request: FindProductRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<ProductResponse> | Observable<ProductResponse> | ProductResponse;

  findAllProducts(
    request: FindAllProductsRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<ProductsResponse> | Observable<ProductsResponse> | ProductsResponse;
}

export function ProductsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "update", "delete", "findProduct", "findAllProducts"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCTS_SERVICE_NAME = "ProductsService";
