import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Scout from 'src/db/models/scout.model';
import Podhod from 'src/db/models/podhod.model';

@Injectable()
export default class PodhodService {
  private readonly logger = new Logger(PodhodService.name);

  constructor(
    @InjectModel(Podhod) private readonly podhodModel: typeof Podhod,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Podhod>> {
    try {
      const podhod = await this.podhodModel.findAll({raw: true});
      return podhod;
    } catch (error) {
      console.error('Error retrieving podhod:', error);
      throw error;
    }
  }

}
