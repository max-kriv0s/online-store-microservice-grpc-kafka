import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { appValidationSchema } from './config/app-validation-schema';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfiguration } from './config/winston.logger.config';
import { CategoriesModule } from './module/categories/categories.module';
import { ProductsModule } from './module/products/products.module';
import { PricesModule } from './module/prices/prices.module';
import { WarehousesModule } from './module/warehouses/warehouses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: appValidationSchema,
    }),
    DatabaseModule,
    WinstonModule.forRootAsync({
      useFactory: winstonLoggerConfiguration,
      inject: [ConfigService],
    }),
    CategoriesModule,
    ProductsModule,
    PricesModule,
    WarehousesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
