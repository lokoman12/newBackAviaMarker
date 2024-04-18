import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import { Taxiway } from 'src/db/models/taxiway.model';

@Controller('taxiway')
export class TaxiwayController {
  private readonly log = new Logger(TaxiwayController.name);

  constructor(
    @InjectModel(Taxiway) private readonly taxiwayModel: typeof Taxiway,
  ) {
    this.log.log('Init controller');
  }

  @Get()
  async getAllTaxiway(): Promise<Taxiway[]> {
    try {
      const taxiway = await this.taxiwayModel.findAll();
      return taxiway;
    } catch (error) {
      console.error('Error retrieving taxiway:', error);
      throw error;
    }
  }
}