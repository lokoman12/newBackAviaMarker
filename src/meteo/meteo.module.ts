import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Meteo from 'src/db/models/meteo.model';
import { MeteoController } from './meteo.controller';
import MeteoService from './meteo.service';


@Module({
  imports: [SequelizeModule.forFeature([Meteo])],
  providers: [MeteoService],
  controllers: [MeteoController],
  exports: [SequelizeModule, MeteoService],
})
export class MeteoModule {}