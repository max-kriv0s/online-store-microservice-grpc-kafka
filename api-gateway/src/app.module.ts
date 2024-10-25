import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { appValidationSchema } from './config/app-validation-schema';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfiguration } from './config/winston.logger.config';
import { UsersModule } from './module/users/users.module';
import { CategoriesModule } from './module/categories/categories.module';
import { ProductsModule } from './module/products/products.module';
import { PricesModule } from './module/prices/prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: appValidationSchema,
    }),
    WinstonModule.forRootAsync({
      useFactory: winstonLoggerConfiguration,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    PricesModule,
  ],
})
export class AppModule {}
