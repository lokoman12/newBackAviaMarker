import { Body, Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Polygon from 'src/db/models/polygon.model';
import * as turf from '@turf/turf';
import { ApiQuery } from '@nestjs/swagger';
import { GeoType } from 'src/photo/types';
import Photo from 'src/db/models/photo.model';
import { EMPTY_STRING } from 'src/consts/common';

@Controller('/savePolygon')
export class SavePolygonController {
  private readonly logger = new Logger(SavePolygonController.name);

  constructor(
    @InjectModel(Polygon) private readonly polygonModel: typeof Polygon,
    @InjectModel(Photo) private readonly photoModel: typeof Photo
  ) {
    this.logger.log('Init controller');
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
    type: String,
  })
  @Public()
  @Post()
  async createPolygon(
    @Query('project') project: string,
    @Query('coordinates') coordinates: string,
    @Query('mode') mode: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Body('photo') imageData?: string
  ): Promise<void> {
    try {
      const date = new Date();
      const coords = JSON.parse(coordinates);

      if (
        !Array.isArray(coords) ||
        coords.length === 0 ||
        !coords[0].hasOwnProperty('latitude') ||
        !coords[0].hasOwnProperty('longitude')
      ) {
        throw new Error('Invalid coordinates format');
      }

      // Преобразуем координаты в формат [longitude, latitude]
      const parsedCoords = coords.map((coord) => [
        parseFloat(coord.longitude),
        parseFloat(coord.latitude),
      ]);

      // Замыкаем полигон, добавив первую точку в конец
      if (parsedCoords[0] !== parsedCoords[parsedCoords.length - 1]) {
        parsedCoords.push(parsedCoords[0]);
      }

      const polygon = turf.polygon([parsedCoords]);
      const area = turf.area(polygon);

      this.logger.log(`Calculated area: ${area} square meters`);

      const data = {
        name: name || EMPTY_STRING,
        time: date,
        square: area,
        coordinates,
        mode,
        description: description || EMPTY_STRING,
        project
      };
      const createdPolygon = await this.polygonModel.create(data);
      this.logger.log(`createdPolygon: ${JSON.stringify(createdPolygon)}`);
      
      if (imageData?.length > 0) {
        const data = {
          id: createdPolygon.id,
          type: GeoType.polygon,
          photo: imageData,
        };
        await this.photoModel.create(data);
      }
    } catch (error) {
      this.logger.error('Error creating polygon:', error);
      throw error;
    }
  }
}
