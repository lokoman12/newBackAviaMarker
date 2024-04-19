import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Airports, Position } from "src/environment/types";


@Injectable()
export class ApiConfigService {
  constructor(
    private configService: ConfigService
  ) { }

  getJwtSecret(): string {
    return this.configService.get<string>('jwt_secret');
  }


  getUueeCtaLat(): number {
    return this.configService.get<number>('uuee_ctalat');
  }
  getUueeCtaLon(): number {
    return this.configService.get<number>('uuee_ctalon');
  }
  getUueeCtaPosition(): Position {
    return [this.getUueeCtaLon(), this.getUueeCtaLat()];
  }

  getUlliCtaLat(): number {
    return this.configService.get<number>('ulli_ctalat');
  }
  getUlliCtaLon(): number {
    return this.configService.get<number>('ulli_ctalon');
  }
  getUlliCtaPosition(): Position {
    return [this.getUlliCtaLon(), this.getUlliCtaLat()];
  }

  getDbUri(): string {
    return this.configService.get<string>('dbUri');
  }

  getActiveAirportPosition(): Position {
    const activeAirport = this.configService.get<string>('activeAirport');
    switch (activeAirport) {
      case Airports.ULLI:
        return this.getUlliCtaPosition();
      case Airports.UUEE:
        return this.getUueeCtaPosition();
      default:
        throw new Error(`Unknown activeAirport code: ${activeAirport}`);
    }
  }

  getKafkaClientId(): string {
    return this.configService.get<string>('kafka_clientId');
  }
  getKafkaBrokers(): Array<string> {
    return this.configService.get<string>('kafka_brokers').split(',');
  }
  getKafkaConsumerGroupId(): string {
    return this.configService.get<string>('kafka_consumerGroupId');
  }
  getKafkaSubscribeTopic(): string {
    return this.configService.get<string>('kafka_subscribeTopic');
  }
};