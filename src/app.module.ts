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
import { FplnModule } from './flightPlan/user.module';
import { StripsModule } from './Strips/user.module';
import { RetaModule } from './Reta/user.module';
import { RetdModule } from './Retd/user.module';
import { VppStatusModule } from './VppStatus/user.module';


@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    ToiModule,
    AlarmModule,
    PositionModule,
    SaveAlaramModule,
    SavePositionModule,
    ZoneModule,
    SaveZoneModule,
    DeleteZoneModule,
    MeteoModule,
    FplnModule,
    StripsModule,
    RetaModule,
    RetdModule,
    VppStatusModule
  ],
  controllers: [],
})
export class AppModule {}
