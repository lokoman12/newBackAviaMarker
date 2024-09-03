import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Stands from 'src/db/models/stands.model';
import { StandController } from './stand.controller';
import StandService from './stand.service';


@Module({
  imports: [SequelizeModule.forFeature([Stands])],
  providers: [StandService],
  controllers: [StandController],
  exports: [SequelizeModule, StandService],
})
export class StandsModule {}