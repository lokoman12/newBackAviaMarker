import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import PositionAM from 'src/db/models/position.model';

@Injectable()
export default class PositionService {
  private readonly logger = new Logger(PositionService.name);

  constructor(
    @InjectModel(PositionAM) private readonly positionModel: typeof PositionAM,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<PositionAM>> {
    try {
      const meteo = await this.positionModel.findAll();
      return meteo;
    } catch (error) {
      console.error('Error retrieving position:', error);
      throw error;
    }
  }

}
