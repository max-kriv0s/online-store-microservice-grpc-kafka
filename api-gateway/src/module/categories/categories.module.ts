import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ClientsModule } from '@nestjs/microservices';
import { CategoriesServiceConfig } from './categories-service.config';
import { CATEGORIES_CLIENT_NAME } from './categories.constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CATEGORIES_CLIENT_NAME,
        useClass: CategoriesServiceConfig,
      },
    ]),
    JwtModule.register({}),
    AuthModule,
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
