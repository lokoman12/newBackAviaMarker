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

  async updateRdStatus(name: string, status: string): Promise<void> {
    try {
      if (status === 'close') {
        await this.prismaService.rdd.updateMany({
          data: {
            close_rd: 1,
          },
          where: { name_rd: name },
        });
        return;
      }
      if (status === 'open') {
        await this.prismaService.rdd.updateMany({
          data: {
            close_rd: 0,
          },
          where: { name_rd: name },
        });
        return;
      }
    } catch (error) {
      this.logger.error('Error updating rdStatusUpdate:', error);
      throw error;
    }
  }
}
