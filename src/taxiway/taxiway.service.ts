import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Strips from 'src/db/models/strips.model';
import Taxiway from 'src/db/models/taxiway.model';

@Injectable()
export default class TaxiwayService {
  private readonly logger = new Logger(TaxiwayService.name);

  constructor(
    @InjectModel(Taxiway) private readonly taxiwayModel: typeof Taxiway,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<Taxiway>> {
    try {
      const taxiway = await this.taxiwayModel.findAll({raw: true});
      return taxiway;
    } catch (error) {
      console.error('Error retrieving taxiway:', error);
      throw error;
    }
  }

}
