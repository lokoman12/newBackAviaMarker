import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min, isEnum } from 'class-validator';
import { Airports } from "./types";
import { IsDatabaseUrl } from './is.database.url';


export class EnvironmentVariables {
  @IsNumber()
  @Min(3000)
  @Max(9000)
  webPort: number;

  @IsString()
  swaggerApiVersion: string;

  @IsString()
  swaggerApiRelativePath: string;

  @IsNumber()
  ulli_ctalat: number;
  @IsNumber()
  ulli_ctalon: number;

  @IsEnum(Airports)
  activeAirport: string;

  @IsNumber()
  uuee_ctalat: number;
  @IsNumber()
  uuee_ctalon: number;

  @IsString()
  @IsDatabaseUrl()
  dbUri: string;

  @IsString()
  @IsNotEmpty()
  jwt_access_secret: string;

  @IsString()
  @IsNotEmpty()
  jwt_access_expires_in: string

  @IsString()
  @IsNotEmpty()
  jwt_refresh_secret: string;

  @IsString()
  @IsNotEmpty()
  jwt_refresh_expires_in: string;

  @IsNumber()
  @IsPositive()
  historyRecordTablesNumber: number;

  @IsString()
  @IsNotEmpty()
  checkActualOfHistoriesCronMask: string;

  @IsString()
  @IsNotEmpty()
  toiCopyToHistoryCronMask: string;

  @IsString()
  @IsNotEmpty()
  aznbCopyToHistoryCronMask: string;

  @IsString()
  @IsNotEmpty()
  omnicomCopyToHistoryCronMask: string;

  @IsString()
  @IsNotEmpty()
  meteoCopyToHistoryCronMask: string;

  @IsString()
  @IsNotEmpty()
  standsCopyToHistoryCronMask: string;

  @IsNumber()
  @IsPositive()
  historyDaySave: number;

  
}

