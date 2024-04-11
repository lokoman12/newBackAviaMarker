import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './db/sequelize.config';
import { ToiModule } from './Toi/user.module';
import { AlarmModule } from './alarm/user.module';
import { SaveAlaramModule } from './saveAlaram/user.module';
import { SavePositionModule } from './savePosition/user.module';
import { ZoneModule } from './zone/user.module';
import { SaveZoneModule } from './saveZone/user.module';
import { DeleteZoneModule } from './deleteZone/user.module';
import { PositionModule } from './position/user.module';
import { MeteoModule } from './meteo/user.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './environment/env.validation';
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


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env',],
      validate,
    }),
    SequelizeModule.forRoot(sequelizeConfig),
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
    OmnicomModule
  ],
  providers: [ApiConfigService],

  controllers: [],
})
export class AppModule { }
