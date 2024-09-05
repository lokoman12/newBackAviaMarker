import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Aznb from 'src/db/models/aznb.model';
import { Op } from 'sequelize';

@Injectable()
export default class AznbService {
  private readonly logger = new Logger(AznbService.name);

  constructor(
    @InjectModel(Aznb) private readonly aznbModel: typeof Aznb,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Aznb>> {
    try {
      const aznb = await this.aznbModel.findAll({
        raw: true,
        where: {
          trs_adress: {
            [Op.and]: {
              [Op.not]: null,
              [Op.ne]: 0,
            },
          },
          Id_Tr: {
            [Op.and]: {
              [Op.not]: null,
              [Op.ne]: '',
            },
          },
        },
      });
      return aznb;
    } catch (error) {
      console.error('Error retrieving aznb:', error);
      throw error;
    }
  }

}
