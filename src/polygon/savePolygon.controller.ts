import { Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Polygon from 'src/db/models/polygon.model';
import * as turf from '@turf/turf';
import { ApiQuery } from '@nestjs/swagger';

@Controller('savePolygon')
export class SavePolygonController {
  private readonly log = new Logger(SavePolygonController.name);

  constructor(
    @InjectModel(Polygon) private readonly polygonModel: typeof Polygon,
  ) {
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
  async createPolygon(
    @Query('project') project: string,
    @Query('coordinates') coordinates: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
  ): Promise<Polygon> {
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

      this.log.log(`Calculated area: ${area} square meters`);

      const data = {
        name: name || "",
        time: date,
        square: area,
        coordinates,
        description: description || "",
        project
      };
      const createdPolygon = await this.polygonModel.create(data);
      return createdPolygon;
    } catch (error) {
      this.log.error('Error creating polygon:', error);
      throw error;
    }
  }
}
