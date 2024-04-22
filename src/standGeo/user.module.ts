import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import StandsGeo from 'src/db/models/standsGeo.model';
import { StandGeoController } from './standGeo.controller';


@Module({
  imports: [SequelizeModule.forFeature([StandsGeo])],
  controllers: [StandGeoController],
  exports: [SequelizeModule],
})
export class StandGeoModule {}