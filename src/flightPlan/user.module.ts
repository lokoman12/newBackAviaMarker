import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import FlightPlan from 'src/db/models/fpln.model';
import { FlightPlanController } from './flightPlan.controller';





@Module({
  imports: [SequelizeModule.forFeature([FlightPlan])],
  controllers: [FlightPlanController],
  exports: [SequelizeModule],
})
export class FplnModule {}