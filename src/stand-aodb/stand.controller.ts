import { Controller, Get } from '@nestjs/common';
import { Logger } from '@nestjs/common';
// import { AccessTokenGuard } from '../auth/guards/access.token.guard';
// import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import StandService from './stand.service';
import { stands_aodb } from '@prisma/client';


@Controller('/stand')
export class StandController {
  private readonly logger = new Logger(StandController.name);

  constructor(
    private readonly standService: StandService
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllStand(): Promise<Array<stands_aodb>> {
      return this.standService.getActualData();
  }
}