import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Stands from 'src/db/models/stands.model';
import { Op } from 'sequelize';

@Injectable()
export default class StandService {
  private readonly logger = new Logger(StandService.name);

  constructor(
    @InjectModel(Stands) private readonly standsModel: typeof Stands,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Stands>> {
    try {
      const stands = await this.standsModel.findAll({
        raw: true,
        where: {
          [Op.or]: {
            calls_arr: {
              [Op.and]: {
                [Op.not]: null,
                [Op.ne]: '',
              },
            },
            calls_dep: {
              [Op.and]: {
                [Op.not]: null,
                [Op.ne]: '',
              },
            },
          },
        }
      });

      return stands;
    } catch (error) {
      console.error('Error retrieving stands:', error);
      throw error;
    }
  }

}
