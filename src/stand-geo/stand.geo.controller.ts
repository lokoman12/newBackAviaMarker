import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import StandsGeo from 'src/db/models/standsGeo.model';
import { Public } from 'src/auth/decorators/public.decorator';
import { AccessTokenGuard } from 'src/auth/guards/access.token.guard';
import StandGeoService from './stand.geo.service';


@Controller('/standGeo')
export class StandGeoController {
  private readonly logger = new Logger(StandGeoController.name);

  constructor(
    private readonly standGeoService: StandGeoService,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllStandsGeo(): Promise<Array<StandsGeo>> {
      return this.standGeoService.getActualData();
  }
}