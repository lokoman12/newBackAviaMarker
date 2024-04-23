import { Module } from '@nestjs/common';
import { ToiModule } from './Toi/user.module';
import { AlarmModule } from './alarm/user.module';
import { SaveAlaramModule } from './saveAlaram/user.module';
import { SavePositionModule } from './savePosition/user.module';
import { ZoneModule } from './zone/user.module';
import { SaveZoneModule } from './saveZone/user.module';
import { DeleteZoneModule } from './deleteZone/user.module';
import { PositionModule } from './position/user.module';
import { MeteoModule } from './meteo/user.module';
import { ApiConfigModule } from './config/config.module';
import { AodbModule } from './AODB/user.module';
import { StripsModule } from './Strips/user.module';
import { RetaModule } from './Reta/user.module';
import { RetdModule } from './Retd/user.module';
import { VppStatusModule } from './VppStatus/user.module';
import { KafkaModule } from './Kafka/user.module';
import { ScoutModule } from './SCOUT/user.module';
import { OmnicomModule } from './Omnicom/user.module';
import { ApiConfigService } from './config/api.config.service';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { PodhodModule } from './podhod/user.module';
import { StandsModule } from './stand_aodb/user.module';
import { CookiesModule } from './cookie/cookies.module';
import { DatabaseModule } from './db/database.module';
import { TaxiwayModule } from './taxiway/user.module';
import { StandGeoModule } from './standGeo/user.module';


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
    StandGeoModule
  ],
  providers: [ApiConfigService],

  controllers: [],
})
export class AppModule { }
