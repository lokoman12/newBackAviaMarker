import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { azn_b } from '@prisma/client';

@Injectable()
export default class AznbService {
  private readonly logger = new Logger(AznbService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    // this.logger.log('Init service');
  }

  async getActualData(): Promise<Array<azn_b>> {
    try {
      const aznb = await this.prismaService.azn_b.findMany({
        where: {
          trs_adress: { not: 0, },
          AND: [
            {
              Id_Tr: { not: null, },
            },
            {
              Id_Tr: { not: '', },
            }

          ]
        }
      });
      return aznb;
    } catch (error) {
      console.error('Error retrieving aznb:', error);
      throw error;
    }
  }

}
