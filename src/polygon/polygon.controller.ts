import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Polygon from 'src/db/models/polygon.model';

@Controller('polygons')
export class PolygonController {
  private readonly log = new Logger(PolygonController.name);

  constructor(
    @InjectModel(Polygon) private readonly polygonModel: typeof Polygon,
  ) {
    this.log.log('Init controller');
  }
  @Public()
  @Get()
  async getAllPolygons(): Promise<Polygon[]> {
    try {
      const polygons = await this.polygonModel.findAll();
      return polygons;
    } catch (error) {
      this.log.error('Error retrieving polygons:', error);
      throw error;
    }
  }
}
