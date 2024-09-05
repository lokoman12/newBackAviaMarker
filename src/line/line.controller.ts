import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import Line from 'src/db/models/line.model';


@Controller('lines')
export class LineController {
  private readonly logger = new Logger(LineController.name);

  constructor(
    @InjectModel(Line) private readonly lineModel: typeof Line,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  @Get()
  async getAllLine(): Promise<Line[]> {
    try {
      const lines = await this.lineModel.findAll();
      return lines;
    } catch (error) {
      this.logger.error('Error retrieving lines:', error);
      throw error;
    }
  }
}