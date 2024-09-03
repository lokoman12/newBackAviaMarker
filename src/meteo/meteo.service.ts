import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Meteo from 'src/db/models/meteo.model';

@Injectable()
export default class MeteoService {
  private readonly logger = new Logger(MeteoService.name);

  constructor(
    @InjectModel(Meteo) private readonly meteoModel: typeof Meteo,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Meteo>> {
    try {
      const meteo = await this.meteoModel.findAll();
      return meteo;
    } catch (error) {
      console.error('Error retrieving meteo:', error);
      throw error;
    }
  }

}
