import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Point from 'src/db/models/point.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('savePoints')
export class SavePointController {
  private readonly log = new Logger(SavePointController.name);

  constructor(@InjectModel(Point) private readonly pointModel: typeof Point) {
    this.log.log('Init controller');
  }
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'description',
    required: false,
    type: String,
  })
  @Public()
  @Post()
  async createPoint(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
    @Query('project') project: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
  ): Promise<Point> {
    try {
      if (lat == null || lon == null) {
        throw new Error('Широта и долгота являются обязательными полями');
      }
      const date = new Date();
      const data = {
        name: name !== undefined ? name : '',
        time: date,
        lat,
        lon,
        radius,
        description: description !== undefined ? description : '',
        project: project || '',
      };
      const point = await this.pointModel.create(data);
      return point;
    } catch (error) {
      this.log.error('Ошибка при создании точки:', error);
      throw error;
    }
  }

}
