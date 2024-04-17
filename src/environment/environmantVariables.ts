import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min, isEnum } from 'class-validator';
import { Airports } from "./types";


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
  @IsNotEmpty()
  jwt_secret: string;
}

