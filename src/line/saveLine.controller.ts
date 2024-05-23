import { Body, Controller, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Line from 'src/db/models/line.model';
import * as turf from '@turf/turf';
import { ApiQuery } from '@nestjs/swagger';

@Controller('saveLine')
export class SaveLineController {
  private readonly log = new Logger(SaveLineController.name);

  constructor(@InjectModel(Line) private readonly lineModel: typeof Line) {
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
    @Body('photo') photo?: string
  ): Promise<Line> {
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

      this.log.log(`Calculated total length: ${totalLength} meters`);

      const date = new Date();
      // const photoBuffer = photo ? Buffer.from(photo as string, 'base64') : null;
      const data = {
        name: name || '',
        time: date,
        distance: totalLength,
        coordinates,
        mode,
        photo: photo || '',
        description: description || '',
        project,
      };
      const line = await this.lineModel.create(data);
      return line;
    } catch (error) {
      this.log.error('Error creating line:', error);
      throw error;
    }
  }
}
