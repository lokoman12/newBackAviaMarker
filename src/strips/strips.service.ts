import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Strips from 'src/db/models/strips.model';

@Injectable()
export default class StripsService {
  private readonly logger = new Logger(StripsService.name);

  constructor(
    @InjectModel(Strips) private readonly stripsModel: typeof Strips,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Strips>> {
    try {
      const strips = await this.stripsModel.findAll();
      return strips;
    } catch (error) {
      console.error('Error retrieving strips:', error);
      throw error;
    }
  }

}
