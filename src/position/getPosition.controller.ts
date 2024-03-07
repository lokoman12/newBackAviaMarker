import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { PositionAM } from 'src/db/models/position.model';

@Controller('position')
export class PositionController {
  private readonly log = new Logger(PositionController.name);

  constructor(
    @InjectModel(PositionAM) private readonly positionModel: typeof PositionAM,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllAlram(): Promise<PositionAM[]> {
    try {
      const position = await this.positionModel.findAll();
      return position;
    } catch (error) {
      console.error('Error retrieving alarm:', error);
      throw error;
    }
  }
}