import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import AODB from 'src/db/models/fpln.model';
import { AodbController } from './flight.plan.controller';


@Module({
  imports: [SequelizeModule.forFeature([AODB])],
  controllers: [AodbController],
  exports: [SequelizeModule],
})
export class AodbModule {}