import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Taxiway from 'src/db/models/taxiway.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';

@Controller('taxiway')
export class TaxiwayController {
  private readonly logger = new Logger(TaxiwayController.name);

  constructor(
    @InjectModel(Taxiway) private readonly taxiwayModel: typeof Taxiway,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllTaxiway(): Promise<Array<Taxiway>> {
    try {
      const taxiway = await this.taxiwayModel.findAll();
      return taxiway;
    } catch (error) {
      console.error('Error retrieving taxiway:', error);
      throw error;
    }
  }
}