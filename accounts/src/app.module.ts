import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfiguration } from './config/winston.logger.config';
import configuration from './config/configuration';
import { appValidationSchema } from './config/app-validation-schema';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';

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
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
