import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import AODB from 'src/db/models/fpln.model';
import { AODBController } from './flight.plan.controller';


@Module({
  imports: [SequelizeModule.forFeature([AODB])],
  controllers: [AODBController],
  exports: [SequelizeModule],
})
export class AodbModule {}