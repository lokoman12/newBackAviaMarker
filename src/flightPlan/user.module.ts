import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import AODB from '../db/models/fpln.model';
import { FlightPlanController } from './flightPlan.controller';


@Module({
  imports: [SequelizeModule.forFeature([AODB])],
  controllers: [FlightPlanController],
  exports: [SequelizeModule],
})
export class FplnModule {}