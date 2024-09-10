import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AirportStateController as AirportStateController } from './airportState.controller';
import AirportStateService from './airportState.service';
import { ToiModule } from 'src/toi/toi.module';
import { AznbModule } from 'src/aznb/aznb.module';
import { OmnicomModule } from 'src/omnicom/omnicom.module';
import { StandsModule } from 'src/stand-aodb/stand.aodb.module';
import { PositionModule } from 'src/position/position.module';
import { StripsModule } from 'src/strips/strips.module';
import { ApiConfigModule } from 'src/config/config.module';
import { FplnModule } from 'src/fpln/fpln.module';
import { MeteoModule } from 'src/meteo/meteo.module';
import { AlarmModule } from 'src/alarm/alarm.module';
import { TaxiwayModule } from 'src/taxiway/taxiway.module';
import { VppStatusModule } from 'src/vpp-status/vpp.module';


@Module({
  imports: [ApiConfigModule, ToiModule, AznbModule, OmnicomModule, StandsModule, PositionModule, StripsModule, FplnModule, VppStatusModule, MeteoModule, TaxiwayModule, AlarmModule],
  providers: [AirportStateService],
  controllers: [AirportStateController],
  exports: [AirportStateService],
})
export class AirportStateModule implements NestModule{
  private readonly logger = new Logger(AirportStateModule.name);
  
  configure(consumer: MiddlewareConsumer) {
    this.logger.debug('Init AirportStateModule');
  }
}