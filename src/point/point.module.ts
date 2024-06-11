import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PointController } from './point.controller';
import Point from 'src/db/models/point.model';
import { SavePointController } from './savePoint.controller';
import { SendPointController } from './sendPoint.controller';
import { ReceivePointController } from './receivePoint.controller';
import Photo from 'src/db/models/photo.model';

@Module({
  imports: [SequelizeModule.forFeature([Point, Photo])],
  controllers: [PointController, SavePointController, SendPointController, ReceivePointController],
  exports: [SequelizeModule],
})
export class PointModule {}