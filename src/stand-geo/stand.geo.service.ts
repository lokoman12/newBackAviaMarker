import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import StandsGeo from 'src/db/models/standsGeo.model';

@Injectable()
export default class StandGeoService {
  private readonly logger = new Logger(StandGeoService.name);

  constructor(
    @InjectModel(StandsGeo) private readonly standsGeoModel: typeof StandsGeo,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<StandsGeo>> {
    try {
      const standGeo = await this.standsGeoModel.findAll({raw: true});
      return standGeo;
    } catch (error) {
      console.error('Error retrieving stands geo:', error);
      throw error;
    }
  }

}
