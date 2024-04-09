import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from 'class-validator';
import { IsLongerThan as IsDatabaseUrl } from './isDatabaseUrl';

enum Environment {
  Development = 'dev',
  Production = 'prod',
}

export enum DATABASE_TYPE {
  mysql = 'mysql',
  postgresql = 'postgresql',
}
