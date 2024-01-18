import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Line } from 'src/db/models/line.model';
import { Logger } from '@nestjs/common';

@Controller('lines')
export class LineController {
  private readonly log = new Logger(LineController.name);

  constructor(
    @InjectModel(Line) private readonly lineModel: typeof Line,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllLines(): Promise<Line[]> {
    try {
      const lines = await this.lineModel.findAll();
      console.log('Lines:', lines);
      return lines;
      // return [];
    } catch (error) {
      console.error('Error retrieving lines:', error);
      throw error;
    }
  }
}