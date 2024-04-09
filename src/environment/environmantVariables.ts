import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from 'class-validator';
import { IsLongerThan as IsDatabaseUrl } from './isDatabaseUrl';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  @IsDatabaseUrl('NODE_ENV', {
    message: "Строка должна быть валидным урлом до базы данных. Пример: mysql://<user>:<password>@<host>:<port>/<database-name>",
  })
  DATABASE_URL: string;

  @IsNumber()
  @Min(3000)
  @Max(9000)
  WEB_PORT: number;

  @IsString()
  API_VERSION: string;

  @IsString()
  API_RELATIVE_PATH: string;
}