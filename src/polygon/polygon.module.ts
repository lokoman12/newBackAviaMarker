import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Polygon from 'src/db/models/polygon.model';
import { PolygonController } from './polygon.controller';
import { SavePolygonController } from './savePolygon.controller';
import Photo from 'src/db/models/photo.model';

@Module({
  imports: [SequelizeModule.forFeature([Polygon, Photo])],
  controllers: [PolygonController, SavePolygonController],
  exports: [SequelizeModule],
})
export class PolygonsModule {}