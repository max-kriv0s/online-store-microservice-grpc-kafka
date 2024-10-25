import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { PRICES_CLIENT_NAME } from './prices.constants';
import { PricesServiceConfig } from './prices-service.config';
import { PricesMapper } from './prices.mapper';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRICES_CLIENT_NAME,
        useClass: PricesServiceConfig,
      },
    ]),
    JwtModule.register({}),
    AuthModule,
  ],
  providers: [PricesService, PricesMapper],
  controllers: [PricesController],
})
export class PricesModule {}
