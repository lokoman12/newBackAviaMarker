import { Body, Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Line from 'src/db/models/line.model';
import * as turf from '@turf/turf';
import { ApiQuery } from '@nestjs/swagger';
import { GeoType } from 'src/photo/types';
import Photo from 'src/db/models/photo.model';

@Controller('/saveLine')
export class SaveLineController {
  private readonly logger = new Logger(SaveLineController.name);

  constructor(
    @InjectModel(Line) private readonly lineModel: typeof Line,
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
  async createLine(
    @Query('coordinates') coordinates: string,
    @Query('project') project: string,
    @Query('mode') mode: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Body('photo') imageData?: string
  ): Promise<void> {
    try {
      const coords = JSON.parse(coordinates);
      if (
        !Array.isArray(coords) ||
        coords.length === 0 ||
        !coords[0].hasOwnProperty('latitude') ||
        !coords[0].hasOwnProperty('longitude')
      ) {
        throw new Error('Invalid coordinates format');
      }

      let totalLength = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        const from = turf.point([
          parseFloat(coords[i].longitude),
          parseFloat(coords[i].latitude),
        ]);
        const to = turf.point([
          parseFloat(coords[i + 1].longitude),
          parseFloat(coords[i + 1].latitude),
        ]);
        totalLength += turf.distance(from, to, { units: 'meters' });
      }

      this.logger.log(`Calculated total length: ${totalLength} meters`);

      const date = new Date();
      const data = {
        name: name || '',
        time: date,
        distance: totalLength,
        coordinates,
        mode,
        description: description || '',
        project,
      };
      const line = await this.lineModel.create(data);

      if (imageData?.length > 0) {
        const data = {
          id: line.id,
          type: GeoType.line,
          photo: imageData,
        };
        await this.photoModel.create(data);
      }
    } catch (error) {
      this.logger.error('Error creating line:', error);
      throw error;
    }
  }
}
