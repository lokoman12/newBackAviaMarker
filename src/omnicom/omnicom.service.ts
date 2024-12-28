import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SCOUT } from '@prisma/client';

// export type GeneralOmnicomResponseType = Array<Scout> | HistoryResponseType;

@Injectable()
export default class OmnicomService {
  private readonly logger = new Logger(OmnicomService.name);

  constructor(
    private prismaService: PrismaService,
  ) {
    // this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<SCOUT>> {
    // this.logger.log(`Omnicom getActualData, start`);
    try {
      const omnicom = await this.prismaService.sCOUT.findMany();
      return omnicom;
    } catch (error) {
      console.error('Error retrieving omnicom:', error);
      throw error;
    }
  }

}
