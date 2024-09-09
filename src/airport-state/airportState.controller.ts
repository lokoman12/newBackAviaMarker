import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import AirportStateService from './airportState.service';
import { AirportState } from './types';


@Controller('/airport-state')
export class AirportStateController {
  private readonly logger = new Logger(AirportStateController.name);

  constructor(
    private readonly airportStateService: AirportStateService
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAirportInfo(): Promise<AirportState> {
      return this.airportStateService.getActualData();
  }
}