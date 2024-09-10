import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import AODB from 'src/db/models/fpln.model';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import FplnService from './fpln.service';


@Controller('/aodb')
export class FplnController {
  private readonly logger = new Logger(FplnController.name);

  constructor(
    private readonly flightPlanService: FplnService,
  ) {
    this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllFlightPlans(): Promise<Array<AODB>> {
    return await this.flightPlanService.getActualData();
  }
}