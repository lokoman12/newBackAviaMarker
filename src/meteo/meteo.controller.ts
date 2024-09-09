import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import Meteo from 'src/db/models/meteo.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import MeteoService from './meteo.service';


@Controller('/meteo')
export class MeteoController {
  private readonly logger = new Logger(MeteoController.name);

  constructor(
    private readonly meteoService: MeteoService,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllMeteo(): Promise<Array<Meteo>> {
    return this.meteoService.getActualData();
  }
}