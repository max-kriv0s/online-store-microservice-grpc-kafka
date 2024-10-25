import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appValidationSchema } from './config/app-validation-schema';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfiguration } from './config/winston.logger.config';
import { ProductBasketsModule } from './module/product-baskets/product-baskets.module';
import { OrdersModule } from './module/orders/orders.module';

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
    ProductBasketsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
