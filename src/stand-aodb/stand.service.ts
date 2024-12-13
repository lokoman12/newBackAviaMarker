import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { stands_aodb } from '@prisma/client';
import { saveStringifyBigInt } from 'src/toi/toi.controller';

@Injectable()
export default class StandService {
  private readonly logger = new Logger(StandService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<stands_aodb>> {
    try {
      const stands = await this.prismaService.stands_aodb.findMany({
        where: {
          OR: [
            {
              AND: [
                { calls_arr: {not: null,}},
                { calls_arr: {not: '',}},
              ],
            },
            {
              AND: [
                { calls_dep: {not: null,}},
                { calls_dep: {not: '',}},
              ],
            },
          ],
        }
      });

      return saveStringifyBigInt(stands);
    } catch (error) {
      console.error('Error retrieving stands:', error);
      throw error;
    }
  }

}
