import { INestMicroservice } from '@nestjs/common';
import { DataSource } from 'typeorm';
import fns from 'date-fns';

export async function truncateDbTables(microservice: INestMicroservice) {
  const dataSource = microservice.get<DataSource>(DataSource);
  const migrationsTableName = 'migrations';
  const tableNames = await dataSource.query(
    `SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename != '${migrationsTableName}';`,
  );

  const tables = tableNames.map(({ tablename }) => `"public"."${tablename}"`).join(', ');
  try {
    await dataSource.query(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log(error);
  }
}

export function getRandomString(characterCount: number) {
  let totalString = '';
  while (totalString.length < characterCount) {
    totalString += Math.random().toString(36).substring(2);
  }
  return totalString.substring(0, characterCount);
}

export const dateStringToNumber = (value: string) => {
  const date = new Date(value);
  return date.getTime();
};

export function convertNumberPeriodToStartOfDay(period: number): number {
  return fns.startOfDay(new Date(period)).getTime();
}
