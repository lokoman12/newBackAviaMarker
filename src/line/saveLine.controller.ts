import { Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Line from 'src/db/models/line.model';
import * as turf from '@turf/turf';

@Controller('saveLine')
export class SaveLineController {
  private readonly log = new Logger(SaveLineController.name);

  constructor(
    @InjectModel(Line) private readonly lineModel: typeof Line,
  ) {
    this.log.log('Init controller');
  }

  @Public()
  @Post()
  async createLine(
    @Query('name') name: string,
    @Query('coordinates') coordinates: string,
    @Query('description') description: string
  ): Promise<Line> {
    try {
      const coordinat = JSON.parse(coordinates);
      const lineString = turf.lineString(coordinat.map(coord => [parseFloat(coord[0]), parseFloat(coord[1])]));
      const totalLength = turf.length(lineString, { units: 'kilometers' });

      const date = new Date();
      const data = {
        name,
        time: date,
        distance: totalLength,
        coordinates,
        description
      };
      const line = await this.lineModel.create(data);
      return line;
    } catch (error) {
      this.log.error('Error creating line:', error);
      throw error;
    }
  }
}
