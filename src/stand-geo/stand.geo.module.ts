import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import StandsGeo from 'src/db/models/standsGeo.model';
import { StandGeoController } from './standGeo.controller';
import { AddStandGeoController } from './AddStandGeo.controller ';


@Module({
  imports: [SequelizeModule.forFeature([StandsGeo])],
  controllers: [StandGeoController, AddStandGeoController],
  exports: [SequelizeModule],
})
export class StandGeoModule {}