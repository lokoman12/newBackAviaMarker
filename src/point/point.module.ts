import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PointController } from './point.controller';
import Point from 'src/db/models/point.model';



@Module({
  imports: [SequelizeModule.forFeature([Point])],
  controllers: [PointController],
  exports: [SequelizeModule],
})
export class PointModule {}