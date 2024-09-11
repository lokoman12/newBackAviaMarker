import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Airports, Position } from "src/environment/types";
import { loggers } from "winston";


@Injectable()
export class ApiConfigService {
  private readonly logger = new Logger(ApiConfigService.name);

  constructor(
    private configService: ConfigService
  ) { }

  getDisableCopyHistory() {
    return this.configService.get<boolean>('disableCopyHistory');
  }

  getHistoryRecordTablesNumber() {
    return this.configService.get<number>('historyRecordTablesNumber');
  }

  getToiCopyToHistoryCronMask() {
    return this.configService.get<string>('toiCopyToHistoryCronMask');
  }

  getAznbCopyToHistoryCronMask() {
    return this.configService.get<string>('aznbCopyToHistoryCronMask');
  }

  getOmnicomCopyToHistoryCronMask() {
    return this.configService.get<string>('omnicomCopyToHistoryCronMask');
  }

  getStandsCopyToHistoryCronMask() {
    return this.configService.get<string>('standsCopyToHistoryCronMask');
  }

  getMeteoCopyToHistoryCronMask() {
    return this.configService.get<string>('meteoCopyToHistoryCronMask');
  }


  getJwtAccessExpiresIn(): string {
    return this.configService.get<string>('jwt_access_expires_in');
  }
  getJwtAccessSecret(): string {
    return this.configService.get<string>('jwt_access_secret');
  }
  getJwtRefreshExpiresIn(): string {
    return this.configService.get<string>('jwt_refresh_expires_in');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('jwt_refresh_secret');
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

  getDbProperties(): string {
    return this.configService.get<string>('dbUri');
  }

  isActiveAirportUlli(): boolean {
    const activeAirport = this.configService.get<string>('activeAirport');
    this.logger.log(`isActiveAirportUlli: ${activeAirport}`);
    return activeAirport === Airports.ULLI;
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
  getHowDaySave(): number {
    return this.configService.get<number>('historyDaySave');
  }
  getToiCheckToHistoryCronMask() {
    return this.configService.get<string>('checkActualOfHistoriesCronMask');
  }
};