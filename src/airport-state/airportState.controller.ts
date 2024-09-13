import { BadRequestException, Controller, Get, Query, Req } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import AirportStateService from './airportState.service';
import { AirportState } from './types';
import User from 'src/db/models/user';
import { isNull } from 'src/utils/common';


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
    @Query('username') username: string,
    @Req() req: Request
    ): Promise<AirportState> {
    // let username = (req.user as User)?.username;
    // this.logger.log(`username: ${username}`);
    if (isNull(username)) {
      throw new BadRequestException(`Get parameter username is required!`);
    }
    return this.airportStateService.getActualData(username);
  }
}