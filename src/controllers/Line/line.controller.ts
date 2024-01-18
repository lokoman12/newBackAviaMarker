import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Line } from 'src/db/models/line.model';


@Controller('lines')
export class LineController {
  constructor(
    @InjectModel(Line) private readonly lineModel: typeof Line,
  ) {}

  @Get()
  async getAllLines(): Promise<Line[]> {
    try {
      const lines = await this.lineModel.findAll();
      return lines;
    } catch (error) {
      console.error('Error retrieving lines:', error);
      throw error;
    }
  }
}