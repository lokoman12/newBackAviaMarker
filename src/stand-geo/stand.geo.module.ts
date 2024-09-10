import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import StandsGeo from 'src/db/models/standsGeo.model';
import { StandGeoController } from './stand.geo.controller';
import { AddStandGeoController } from './AddStandGeo.controller ';
import StandGeoService from './stand.geo.service';


@Module({
  imports: [SequelizeModule.forFeature([StandsGeo]),],
  providers: [StandGeoService,],
  controllers: [StandGeoController, AddStandGeoController,],
  exports: [StandGeoService, SequelizeModule,],
})
export class StandGeoModule { }