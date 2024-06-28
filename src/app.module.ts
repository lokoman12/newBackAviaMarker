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

@Module({
  imports: [
    ApiConfigModule,
    DatabaseModule,
    // CookiesModule,
    UsersModule,
    AuthModule,
    SettingsModule,
    ToiModule,
    AlarmModule,
    PositionModule,
    SaveAlaramModule,
    SavePositionModule,
    ZoneModule,
    SaveZoneModule,
    DeleteZoneModule,
    MeteoModule,
    AodbModule,
    StripsModule,
    RetaModule,
    RetdModule,
    VppStatusModule,
    // KafkaModule,
    ScoutModule,
    OmnicomModule,
    PodhodModule,
    StandsModule,
    TaxiwayModule,
    StandGeoModule,
    PointModule,
    LineModule,
    PolygonsModule,
    HistoryModule,
    RdStatusModule,
    PhotoModule,
    GetpositionModule,
    UserHistoryModule,
  ],
  providers: [ApiConfigService],

  controllers: [],
})
export class AppModule { }
