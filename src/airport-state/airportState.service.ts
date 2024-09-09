import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';
import Stands from 'src/db/models/stands.model';
import { Op } from 'sequelize';
import ToiService from 'src/toi/toi.service';
import { AirportState, emptyAirportState } from './types';
import OmnicomService from 'src/omnicom/omnicom.service';
import StandService from 'src/stand-aodb/stand.service';
import AznbService from 'src/aznb/aznb.service';

@Injectable()
export default class AirportStateService {
  private readonly logger = new Logger(AirportStateService.name);

  constructor(
    private readonly toiService: ToiService,
    private readonly aznbService: AznbService,
    private readonly omnicomService: OmnicomService,
    private readonly standService: StandService,

  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<AirportState> {
    try {
      const toi = await this.toiService.getActualClientData();
      const aznb = await this.aznbService.getActualData();
      const omnicom = await this.omnicomService.getActualData();
      const stands = await this.standService.getActualData();
      return {
        ...emptyAirportState,
        toi,
        aznb,
        omnicom,
        stands,
      };
    } catch (error) {
      console.error('Error retrieving airport info:', error);
      throw error;
    }
  }

}
