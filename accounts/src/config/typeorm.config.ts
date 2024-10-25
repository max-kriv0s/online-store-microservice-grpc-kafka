import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigurationType } from './configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class TypeOrmConfiguration implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigurationType, true>) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const databaseSettings = this.configService.get('databaseSettings', {
      infer: true,
    });

    return {
      type: 'postgres',
      host: databaseSettings.host,
      port: databaseSettings.port,
      username: databaseSettings.user,
      password: databaseSettings.password,
      database: databaseSettings.database,
      autoLoadEntities: false,
      synchronize: false,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      logging: ['error'],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
