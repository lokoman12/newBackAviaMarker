import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import Polygon from 'src/db/models/polygon.model';
import { PolygonController } from './polygon.controller';
import { SavePolygonController } from './savePolygon.controller';





@Module({
  imports: [SequelizeModule.forFeature([Polygon])],
  controllers: [PolygonController, SavePolygonController],
  exports: [SequelizeModule],
})
export class PolygonsModule {}