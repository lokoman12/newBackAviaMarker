import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import AODB from 'src/db/models/fpln.model';
import VppStatus from 'src/db/models/vppStatus.model';

@Injectable()
export default class VppService {
  private readonly logger = new Logger(VppService.name);

  constructor(
    @InjectModel(VppStatus) private readonly vppStatusModel: typeof VppStatus
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<VppStatus>> {
    try {
      const vppStatus = await this.vppStatusModel.findAll({raw: true});
      return vppStatus;
    } catch (error) {
      console.error('Error retrieving vpp:', error);
      throw error;
    }
  }

}
