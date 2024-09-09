import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot(), // Подключаем ConfigModule для работы с env
    ApiConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    SettingsModule,
    ToiModule,
    SavePositionModule,
    MeteoModule,
    AznbModule,
    StripsModule,
    RetaModule,
    RetdModule,
    VppStatusModule,
    ScoutModule,
    OmnicomModule,
    PodhodModule,
    StandsModule,
    TaxiwayModule,
    StandGeoModule,
    HistoryModule,
    RdStatusModule,
    UserHistoryModule,
    SchedulerModule,
    ...(process.env.activeAirport === 'ULLI' ? [AlarmModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [PositionModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [SaveAlaramModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [ZoneModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [SaveZoneModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [DeleteZoneModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [AodbModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [LineModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [PointModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [PolygonsModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [PhotoModule] : []),
    ...(process.env.activeAirport === 'ULLI' ? [GetpositionModule] : []),
    
    ...(process.env.activeAirport === 'UUEE' ? [KafkaModule] : []),
  ],
  providers: [ApiConfigService],
  controllers: [],
})
export class AppModule {}
