import { Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Polygon from 'src/db/models/polygon.model';
import * as turf from '@turf/turf';

@Controller('savePolygon')
export class SavePolygonController {
  private readonly log = new Logger(SavePolygonController.name);

  constructor(
    @InjectModel(Polygon) private readonly polygonModel: typeof Polygon,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  @Post()
  async createPolygon(
    @Query('name') name: string,
    @Query('coordinates') coordinates: string,
    @Query('description') description: string,
  ): Promise<Polygon> {
    try {
      const date = new Date();
      const coordinate = JSON.parse(coordinates)
      const polygonSquare = turf.polygon(coordinate);
      const area = turf.area(polygonSquare);

      const data = {
        name,
        time: date,
        square: JSON.stringify(area),
        coordinates,
        description,
      };
      const polygon = await this.polygonModel.create(data);
      return polygon;
    } catch (error) {
      this.log.error('Error creating polygon:', error);
      throw error;
    }
  }
}


