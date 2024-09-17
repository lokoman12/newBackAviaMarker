import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Scout from 'src/db/models/scout.model';
import { HistoryResponseType } from 'src/history/types';

export type GeneralOmnicomResponseType = Array<Scout> | HistoryResponseType;

@Injectable()
export default class OmnicomService {
  private readonly logger = new Logger(OmnicomService.name);

  constructor(
    @InjectModel(Scout) private readonly omnicomModel: typeof Scout,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Scout>> {
    this.logger.log(`Omnicom getActualData, start`);
    try {
      const omnicom = await this.omnicomModel.findAll({raw: true});
      return omnicom;
    } catch (error) {
      console.error('Error retrieving omnicom:', error);
      throw error;
    }
  }

}
