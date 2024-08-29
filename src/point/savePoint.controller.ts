import { Body, Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Point from 'src/db/models/point.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import Photo from 'src/db/models/photo.model';
import { GeoType } from '../photo/types';
import { isNull } from 'src/utils/common';

@Controller('savePoints')
export class SavePointController {
  private readonly log = new Logger(SavePointController.name);

  constructor(
    @InjectModel(Point) private readonly pointModel: typeof Point,
    @InjectModel(Photo) private readonly photoModel: typeof Photo) {
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
  @ApiBody({
    required: false,
    type: String,
  })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       photo: {
  //         type: 'string',
  //         format: 'binary',
  //       }
  //     }
  //   }
  // })
  @Public()
  @Post()
  async createPoint(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('radius') radius: number,
    @Query('project') project: string,
    @Query('mode') mode: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Body('photo') imageData?: string
  ): Promise<void> {
    this.log.log(`lat: ${lat}, lon: ${lon}, radius: ${radius}, project: ${project}, mode: ${mode}, name: ${name}, description: ${description}, body.photo.length: ${imageData?.length}`)

    try {
      if (isNull(lat) || isNull(lon)) {
        throw new Error('Широта и долгота являются обязательными полями');
      }

      const date = new Date();

      const data = {
        name: name || '',
        time: date,
        lat,
        lon,
        radius,
        mode,
        description: description || '',
        project: project || '',
      };
      const point = await this.pointModel.create(data);

      if (imageData?.length > 0) {
        const data = {
          id: point.id,
          type: GeoType.point,
          photo: imageData,
        };
        await this.photoModel.create(data);
      }
    } catch (error) {
      this.log.error('Ошибка при создании точки:', error);
      throw error;
    }
  }

}
