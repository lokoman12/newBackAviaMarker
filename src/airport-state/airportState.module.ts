import { Module } from '@nestjs/common';
import { AirportStateController as AirportStateController } from './airportState.controller';
import AirportStateService from './airportState.service';
import { ToiModule } from 'src/toi/toi.module';
import { AznbModule } from 'src/aznb/aznb.module';
import { OmnicomModule } from 'src/omnicom/omnicom.module';
import { StandsModule } from 'src/stand-aodb/stand.aodb.module';


@Module({
  imports: [ToiModule, AznbModule, OmnicomModule, StandsModule,],
  providers: [AirportStateService],
  controllers: [AirportStateController],
  exports: [AirportStateService],
})
export class AirportStateModule { }