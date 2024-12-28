import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { taxiway } from '@prisma/client';
import TaxiwayService from './taxiway.service';

@Controller('/taxiway')
export class TaxiwayController {
  private readonly logger = new Logger(TaxiwayController.name);

  constructor(
    private readonly taxiwayService: TaxiwayService,
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllTaxiway(): Promise<Array<taxiway>> {
    try {
      const taxiway = await this.taxiwayService.getActualData();
      return taxiway;
    } catch (error) {
      console.error('Error retrieving taxiway:', error);
      throw error;
    }
  }
}