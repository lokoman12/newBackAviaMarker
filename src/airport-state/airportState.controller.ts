import { BadRequestException, Controller, Get, Query, Req, } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import AirportStateService from './airportState.service';
import { AirportState, AirportStateAllHistory } from './types';
import { isNull } from 'src/utils/common';
import { isNormalNumber } from 'src/utils/number';


@Controller('/airport-state')
export class AirportStateController {
  private readonly logger = new Logger(AirportStateController.name);

  constructor(
    private readonly airportStateService: AirportStateService
  ) {
    // this.logger.log('Init controller');
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAirportInfo(
    @Req() req: Request,
    @Query('username') username: string,
    @Query('isForHistory') isForHistory?: boolean
  ): Promise<AirportState> {
    if (isNull(username)) {
      throw new BadRequestException(`Get parameter username is required!`);
    }
    return this.airportStateService.getActualData(username, isForHistory);
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get("/pack-by-steps-between")
  async getAirportInfoAllHistory(
    @Query('tableNumber') tableNumber: number,
    @Query('startStep') startStep?: number,
    @Query('finishStep') finishStep?: number
  ): Promise<AirportStateAllHistory> {

    const startTime = Date.now();
    this.logger.log(`start request`);
    if (!isNormalNumber(tableNumber)) {
      throw new BadRequestException(`Parameter with name tableNumber is required and should be normal number, the value is ${tableNumber}!`);
    }
    const result = await this.airportStateService.getActualDataAllHistory(tableNumber, startStep, finishStep);
    this.logger.log(`time spent: ${(Date.now() - startTime) / 1000}`);
    return result;
  }
}