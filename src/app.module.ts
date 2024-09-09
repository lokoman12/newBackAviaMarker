import { Module } from '@nestjs/common';
import { ToiModule } from './toi/toi.module';
import { AlarmModule } from './alarm/alarm.module';
import { SaveAlaramModule } from './save-alarm/alarm.module';
import { SavePositionModule } from './save-position/position.module';
import { ZoneModule } from './zone/zone.module';
import { SaveZoneModule } from './save-zone/zone.module';
import { DeleteZoneModule } from './delete-zone/zone.module';
import { PositionModule } from './position/position.module';
import { MeteoModule } from './meteo/meteo.module';
import { ApiConfigModule } from './config/config.module';
import { AodbModule } from './aodb/aodb.module';
import { StripsModule } from './strips/user.module';
import { RetaModule } from './reta/reta.module';
import { RetdModule } from './retd/retd';
import { VppStatusModule } from './vpp-status/vpp.module';
import { KafkaModule } from './kafka/kafka.module';
import { ScoutModule } from './scout/scout.module';
import { OmnicomModule } from './omnicom/omnicom.module';
import { ApiConfigService } from './config/api.config.service';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { PodhodModule } from './podhod/podhod.module';
import { StandsModule } from './stand-aodb/stand.aodb.module';
import { CookiesModule } from './cookie/cookies.module';
import { DatabaseModule } from './db/database.module';
import { TaxiwayModule } from './taxiway/taxiway.module';
import { StandGeoModule } from './stand-geo/stand.geo.module';
import { PointModule } from './point/point.module';
import { LineModule } from './line/line.module';
import { PolygonsModule } from './polygon/polygon.module';
import { HistoryModule } from './history/history.module';
import { RdStatusModule } from './rd-status/rd.module';
import { PhotoModule } from './photo/photo.module';
import { GetpositionModule } from './get-position-history/Getposition.module';
import { UserHistoryModule } from './user-history/user.history.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AznbModule } from './aznb/aznb.module';
import { AirportStateModule } from './airport-state/airportState.module';

@Module({
  imports: [
    ApiConfigModule,
    DatabaseModule,
    // CookiesModule,
    UsersModule,
    AuthModule,
    SettingsModule,
    ToiModule,
    // AlarmModule, для Шарика не надо, только для Пулково
    // PositionModule, для Шарика не надо, только для Пулково
    // SaveAlaramModule, для Шарика не надо, только для Пулково
    // SavePositionModule, для Шарика не надо, только для Пулково
    // ZoneModule, для Шарика не надо, только для Пулково
    // SaveZoneModule, для Шарика не надо, только для Пулково
    // DeleteZoneModule, для Шарика не надо, только для Пулково
    MeteoModule,
    AznbModule,
    AirportStateModule,
    // AodbModule, для Шарика не надо, только для Пулково
    StripsModule,
    RetaModule,
    RetdModule,
    VppStatusModule,
    KafkaModule,
    ScoutModule,
    OmnicomModule,
    PodhodModule,
    StandsModule,
    TaxiwayModule,
    StandGeoModule,
    // PointModule, для Шарика не надо, только для Пулково
    // LineModule, для Шарика не надо, только для Пулково
    // PolygonsModule, для Шарика не надо, только для Пулково
    HistoryModule,
    RdStatusModule,
    // PhotoModule, для Шарика не надо, только для Пулково
    // GetpositionModule, для Шарика не надо, только для Пулково
    UserHistoryModule,
    SchedulerModule,
  ],
  providers: [ApiConfigService],

  controllers: [],
})
export class AppModule { }
