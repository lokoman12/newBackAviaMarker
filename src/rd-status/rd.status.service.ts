import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { rdd } from '@prisma/client';


@Injectable()
export class RdStatusService {
  private readonly logger = new Logger(RdStatusService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.logger.log('Init controller');
  }

  async getActualData(): Promise<Array<rdd>> {
    try {
      const rdStatus = await this.prismaService.rdd.findMany();

      return rdStatus;
    } catch (error) {
      console.error('Error retrieving rd:', error);
      throw error;
    }
  }

  async updateRdStatus(name: string, status: string): Promise<rdd> {
    try {
      if (status === 'close') {
        const rdStatusUpdate = await this.prismaService.rdd.update({
          data: {
            close_rd: 1,
          },
          where: { name_rd: name },
        });
        return rdStatusUpdate;
      }
      if (status === 'open') {
        const rdStatusUpdate = await this.prismaService.rdd.update({
          data: {
            close_rd: 0,
          },
          where: { name_rd: name },
        });
        return rdStatusUpdate;
      }
    } catch (error) {
      this.logger.error('Error updating rdStatusUpdate:', error);
      throw error;
    }
  }
}
