import { Controller, Get, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Line from 'src/db/models/line.model';



@Controller('lines')
export class LineController {
  private readonly log = new Logger(LineController.name);

  constructor(
    @InjectModel(Line) private readonly lineModel: typeof Line,
  ) { }

  @Get()
  async getAllLines(): Promise<Line[]> {
    try {
      const lines = await this.lineModel.findAll();
      return lines;
    } catch (error) {
      this.log.error('Error retrieving lines:', error);
      throw error;
    }
  }
}