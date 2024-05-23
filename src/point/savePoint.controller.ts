import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Point from 'src/db/models/point.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { Buffer } from 'buffer'; // Импортируем модуль buffer

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
  @ApiQuery({
    name: 'photo',
    required: false,
    type: String, // Ожидаем строку в base64
  })
  @Public()
  @Post()
  async createPoint(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
    @Query('project') project: string,
    @Query('mode') mode: string,
    @Query('photo') photo?: string, 
    @Query('name') name?: string,
    @Query('description') description?: string,
  ): Promise<Point> {
    try {
      if (lat == null || lon == null) {
        throw new Error('Широта и долгота являются обязательными полями');
      }

      const date = new Date();

      // Приведение photo к строке и декодирование base64 строки в buffer
      const photoBuffer = photo ? Buffer.from(photo as string, 'base64') : null;

      const data = {
        name: name || '',
        time: date,
        lat,
        lon,
        radius,
        mode,
        photo: photoBuffer,
        description: description || '',
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
