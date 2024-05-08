import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Meteo from 'src/db/models/meteo.model';
import { MeteoController } from './meteo.controller';


@Module({
  imports: [SequelizeModule.forFeature([Meteo])],
  controllers: [MeteoController],
  exports: [SequelizeModule],
})
export class MeteoModule {}