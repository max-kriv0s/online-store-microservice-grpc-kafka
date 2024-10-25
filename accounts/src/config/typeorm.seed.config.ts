import { DataSource, DataSourceOptions } from 'typeorm';
import configuration from './configuration';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

function dataSourceConfiguration(): DataSourceOptions {
  const databaseSettings = configuration().databaseSettings;
  return {
    type: 'postgres',
    host: databaseSettings.host,
    port: databaseSettings.port,
    username: databaseSettings.user,
    password: databaseSettings.password,
    database: databaseSettings.database,
    synchronize: false,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: ['src/database/seeds/*.ts'],
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
    migrationsTableName: 'migrations',
  };
}

const AppDataSource = new DataSource(dataSourceConfiguration());
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized');
  })
  .catch((error) => {
    console.log('Error during Data Source initialization', error);
  });

export default AppDataSource;
