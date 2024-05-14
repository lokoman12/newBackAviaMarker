import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PointController } from './point.controller';
import Point from 'src/db/models/point.model';
import { SavePointController } from './savePoint.controller';



@Module({
  imports: [SequelizeModule.forFeature([Point])],
  controllers: [PointController, SavePointController],
  exports: [SequelizeModule],
})
export class PointModule {}