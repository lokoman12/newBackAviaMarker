import { BadRequestException, Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import AirportStateService from './airportState.service';
import { AirportState, AirportStateAllHistory } from './types';
import User from 'src/db/models/user';
import { isNull } from 'src/utils/common';
import { isNormalNumber } from 'src/utils/number';


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
  async getAllAirportInfo(
    @Req() req: Request,
    @Query('username') username: string,
    @Query('isForHistory') isForHistory?: boolean
  ): Promise<AirportState> {
    // let username = (req.user as User)?.username;
    // this.logger.log(`username: ${username}`);
    if (isNull(username)) {
      throw new BadRequestException(`Get parameter username is required!`);
    }
    return this.airportStateService.getActualData(username, isForHistory);
  }

  @Public()
  // @UseGuards(AccessTokenGuard)
  @Get("/pack-by-steps-between")
  async getAirportInfoAllHistory(
    // @Res() response,
    // @Query('username') username: string,
    @Query('tableNumber') tableNumber: number,
    @Query('startStep') startStep?: number,
    @Query('finishStep') finishStep?: number
    // , @Req() req: Request
  ): Promise<AirportStateAllHistory> {
    // response.setTimeout(300000);
    const startTime = Date.now();
    // let username = (req.user as User)?.username;
    // this.logger.log(`username: ${username}`);
    // if (isNull(username)) {
    // throw new BadRequestException(`Get parameter username is required!`);
    // }
    this.logger.log(`start request`);
    if (!isNormalNumber(tableNumber)) {
      throw new BadRequestException(`Parameter with name tableNumber is required and should be normal number, the value is ${tableNumber}!`);
    }
    const result = await this.airportStateService.getActualDataAllHistory(tableNumber, startStep, finishStep);
    this.logger.log(`time spent: ${(Date.now() - startTime) / 1000}`);
    // this.logger.log(JSON.stringify(result));
    return result;
  }
}