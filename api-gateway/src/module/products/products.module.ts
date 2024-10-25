import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { PRODUCTS_CLIENT_NAME } from './products.constants';
import { ProductsServiceConfig } from './products-service.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRODUCTS_CLIENT_NAME,
        useClass: ProductsServiceConfig,
      },
    ]),
    JwtModule.register({}),
    AuthModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
