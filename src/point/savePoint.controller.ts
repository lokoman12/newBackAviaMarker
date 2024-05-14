import { Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Point from 'src/db/models/point.model';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('savePoints')
export class SavePointController {
  private readonly log = new Logger(SavePointController.name);

  constructor(
    @InjectModel(Point) private readonly pointModel: typeof Point,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  @Post()
  async createPoint(
    @Query('name') name: string,
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
    @Query('description') description: string
  ): Promise<Point> {
    try {
      const date = new Date()
      const data = {
        name,
        time: date,
        lat,
        lon,
        radius,
        description
      };
      const point = await this.pointModel.create(data);
      return point;
    } catch (error) {
      this.log.error('Error creating point:', error);
      throw error;
    }
  }
}
