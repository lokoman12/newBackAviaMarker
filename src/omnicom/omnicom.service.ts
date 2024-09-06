import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Scout from 'src/db/models/scout.model';

@Injectable()
export default class OmnicomService {
  private readonly logger = new Logger(OmnicomService.name);

  constructor(
    @InjectModel(Scout) private readonly omnicomModel: typeof Scout,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Scout>> {
    try {
      const omnicom = await this.omnicomModel.findAll();
      return omnicom;
    } catch (error) {
      console.error('Error retrieving omnicom:', error);
      throw error;
    }
  }

}
